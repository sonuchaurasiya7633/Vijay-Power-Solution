import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import "@/models/User";
import "@/models/SolarProduct";
import { LeadCaptureSchema } from "@/lib/validation/lead";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { sendEmail } from "@/lib/email/mailer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate with Zod
    const parsed = LeadCaptureSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Spam honeypot check
    if (data.website_url_hp && data.website_url_hp.length > 0) {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }

    await connectDB();

    // Check recent duplicate within 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingLead = await Lead.findOne({
      phone: data.phone,
      createdAt: { $gte: yesterday },
    });

    if (existingLead) {
      // Append note/activity to existing lead rather than creating spam duplicate
      await LeadActivity.create({
        leadId: existingLead._id,
        activityType: "note_added",
        title: "Subsequent Website Enquiry Received",
        description: `Customer submitted additional enquiry: "${data.message || 'No message'}" for ${data.solarSolutionType || 'general solar consultation'}.`,
        metadata: { enquiryType: data.enquiryType, solution: data.solarSolutionType },
      });

      return NextResponse.json({
        success: true,
        isDuplicate: true,
        leadId: existingLead.leadId,
        message: "Thank you! We have received your updated requirement and our solar consultant will call you shortly.",
      });
    }

    // Generate unique Lead ID
    const count = await Lead.countDocuments();
    const leadId = `VPS-LD-${String(1001 + count).padStart(4, "0")}`;

    // Create lead
    const newLead = await Lead.create({
      leadId,
      fullName: data.fullName,
      phone: data.phone,
      whatsappPhone: data.whatsappPhone || data.phone,
      email: data.email || undefined,
      state: data.state,
      district: data.district,
      city: data.city,
      postalCode: data.postalCode,
      installationAddress: data.installationAddress,
      customerType: data.customerType,
      enquiryType: data.enquiryType,
      solarSolutionType: data.solarSolutionType,
      productId: data.productId ? data.productId : undefined,
      productName: data.productName,
      wattagePreference: data.wattagePreference,
      requiredSystemSizeKw: data.requiredSystemSizeKw,
      monthlyBillAmount: data.monthlyBillAmount,
      monthlyUnitsConsumed: data.monthlyUnitsConsumed,
      roofType: data.roofType,
      roofAreaSqFt: data.roofAreaSqFt,
      preferredConsultationDate: data.preferredConsultationDate ? new Date(data.preferredConsultationDate) : undefined,
      message: data.message,
      leadSource: data.leadSource,
      landingPage: data.landingPage,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      utmContent: data.utmContent,
      utmTerm: data.utmTerm,
      referrer: data.referrer,
      stage: "new_lead",
      priority: data.customerType === "commercial" || data.customerType === "industrial" ? "high" : "medium",
    });

    // Create initial activity log
    await LeadActivity.create({
      leadId: newLead._id,
      activityType: "created",
      title: "New Lead Created",
      description: `Lead created from source: ${data.leadSource} for ${data.city}, ${data.state}. Requirement: ${data.solarSolutionType || 'General Solar'}`,
      metadata: { initialStage: "new_lead", source: data.leadSource },
    });

    // Trigger asynchronous notification email
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "contact@vijoypowersolution.com";
    sendEmail({
      to: adminEmail,
      subject: `[New Solar Lead] ${newLead.leadId} - ${newLead.fullName} (${newLead.city}, ${newLead.state})`,
      html: `
        <h2>New Solar Consultation Lead Received</h2>
        <p><strong>Lead ID:</strong> ${newLead.leadId}</p>
        <p><strong>Customer Name:</strong> ${newLead.fullName}</p>
        <p><strong>Phone:</strong> ${newLead.phone}</p>
        <p><strong>Location:</strong> ${newLead.city}, ${newLead.state}</p>
        <p><strong>Customer Type:</strong> ${newLead.customerType}</p>
        <p><strong>Solution Interest:</strong> ${newLead.solarSolutionType || 'Not specified'}</p>
        <p><strong>Message / Requirement:</strong> ${newLead.message || 'None'}</p>
        <hr />
        <p>Please log in to the VIJOY POWER SOLUTION Admin CRM to review and assign this lead.</p>
      `,
    }).catch((err) => console.error("Notification email error:", err));

    return NextResponse.json({
      success: true,
      leadId: newLead.leadId,
      message: "Thank you for contacting VIJOY POWER SOLUTION. Our solar engineering expert will reach out to you shortly.",
    });
  } catch (error) {
    console.error("[Create Lead Error]", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "read:leads")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const stage = searchParams.get("stage");
    const priority = searchParams.get("priority");
    const state = searchParams.get("state");
    const customerType = searchParams.get("customerType");
    const search = searchParams.get("search")?.trim();
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 25)));

    const query: Record<string, any> = { isArchived: { $ne: true } };

    // Scoped visibility: sales_executive only views leads assigned to them unless viewer/manager/admin
    if (session.role === "sales_executive") {
      query.assignedTo = session.userId;
    }

    if (stage && stage !== "all") {
      const stageAliases: Record<string, string[]> = {
        new_lead: ["new_lead", "new"],
        site_survey_scheduled: ["site_survey_scheduled", "survey_scheduled"],
        site_survey_completed: ["site_survey_completed", "survey_completed"],
        installation_completed: ["installation_completed", "completed"],
      };
      const matchedStages = stageAliases[stage];
      query.stage = matchedStages ? { $in: matchedStages } : stage;
    }
    if (priority && priority !== "all") query.priority = priority;
    if (state && state !== "all") query.state = state;
    if (customerType && customerType !== "all") query.customerType = customerType;

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { leadId: { $regex: escaped, $options: "i" } },
        { fullName: { $regex: escaped, $options: "i" } },
        { phone: { $regex: escaped, $options: "i" } },
        { city: { $regex: escaped, $options: "i" } },
        { state: { $regex: escaped, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("assignedTo", "name email phone")
        .populate("productId", "name ratedPowerWp coverImage")
        .lean(),
      Lead.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        leads,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[Get Leads Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

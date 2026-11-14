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
import { escapeHtml, escapeRegex, isValidObjectId } from "@/lib/security/sanitize";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/security/rate-limit";
import { createAndBroadcastNotification } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`lead-submit:${ip}`, 12, 15 * 60 * 1000);
    if (!rl.allowed) {
      return rateLimitResponse(
        "Too many enquiry requests from this network. Please wait a few minutes or call our helpline directly.",
        rl.retryAfterSec
      );
    }

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

      // Send in-app & push notification to admins
      createAndBroadcastNotification({
        title: `Updated Solar Enquiry: ${data.fullName}`,
        body: `Customer submitted additional enquiry from ${data.city || ""}, ${data.state}: "${data.message || data.solarSolutionType || 'Solar Enquiry'}" (${existingLead.leadId})`,
        type: "lead",
        link: `/admin/leads/${existingLead._id}`,
        leadId: existingLead._id,
        metadata: { leadId: existingLead.leadId, isDuplicate: true },
      }).catch((e) => console.warn("Notification broadcast notice:", e));

      return NextResponse.json({
        success: true,
        isDuplicate: true,
        leadId: existingLead.leadId,
        message: "Thank you! We have received your updated requirement and our solar consultant will call you shortly.",
      });
    }

    // Generate collision-safe Lead ID
    const lastLead = await Lead.findOne({}, { leadId: 1 }).sort({ createdAt: -1 }).lean();
    let nextSeq = 1001;
    if (lastLead?.leadId) {
      const m = String(lastLead.leadId).match(/(\d+)$/);
      if (m) nextSeq = Math.max(1001, Number(m[1]) + 1);
    }
    const leadId = `VPS-LD-${String(nextSeq).padStart(4, "0")}`;

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
      productId: data.productId && isValidObjectId(data.productId) ? data.productId : undefined,
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

    // Trigger asynchronous notification email (HTML-escaped to prevent injection)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "contact@vijoypowersolution.com";
    sendEmail({
      to: adminEmail,
      subject: `[New Solar Lead] ${newLead.leadId} - ${newLead.fullName} (${newLead.city}, ${newLead.state})`,
      html: `
        <h2>New Solar Consultation Lead Received</h2>
        <p><strong>Lead ID:</strong> ${escapeHtml(newLead.leadId)}</p>
        <p><strong>Customer Name:</strong> ${escapeHtml(newLead.fullName)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(newLead.phone)}</p>
        <p><strong>Location:</strong> ${escapeHtml(newLead.city)}, ${escapeHtml(newLead.state)}</p>
        <p><strong>Customer Type:</strong> ${escapeHtml(newLead.customerType)}</p>
        <p><strong>Solution Interest:</strong> ${escapeHtml(newLead.solarSolutionType || 'Not specified')}</p>
        <p><strong>Message / Requirement:</strong> ${escapeHtml(newLead.message || 'None')}</p>
        <hr />
        <p>Please log in to the VIJOY POWER SOLUTION Admin CRM to review and assign this lead.</p>
      `,
    }).catch((err) => console.error("Notification email error:", err));

    // Trigger real-time Firebase FCM Web Push and MongoDB Notification history
    createAndBroadcastNotification({
      title: `New Solar Enquiry: ${newLead.fullName}`,
      body: `${newLead.city ? `${newLead.city}, ` : ""}${newLead.state} • ${newLead.solarSolutionType || newLead.productName || "General Solar"} (${newLead.leadId})`,
      type: "lead",
      link: `/admin/leads/${newLead._id}`,
      leadId: newLead._id,
      metadata: {
        leadId: newLead.leadId,
        customerName: newLead.fullName,
        phone: newLead.phone,
        city: newLead.city,
        state: newLead.state,
        customerType: newLead.customerType,
      },
    }).catch((notifErr) => console.warn("Notification broadcast notice:", notifErr));

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

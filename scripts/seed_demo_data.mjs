import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Load .env
if (!process.env.MONGODB_URI) {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      envContent.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [key, ...vals] = trimmed.split("=");
          const val = vals.join("=").replace(/^["']|["']$/g, "");
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      });
    }
  } catch (e) {
    console.warn("Could not auto-load .env:", e.message);
  }
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/vijoy_power_solution";

async function seedDemoData() {
  console.log("Connecting to MongoDB Atlas for Demo Data Injection...");
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const defaultPasswordHash = await bcrypt.hash("Solar@2026Secure!", 12);

  // 1. Team Members
  console.log("1. Seeding Staff Team Members with Roles...");
  const usersCol = db.collection("users");
  const demoUsers = [
    {
      name: "R. P. Singh",
      email: "sales.mgr@vijoypowersolution.com",
      passwordHash: defaultPasswordHash,
      role: "sales_manager",
      phone: "+91 94310 00001",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Rahul Verma",
      email: "sales.rahul@vijoypowersolution.com",
      passwordHash: defaultPasswordHash,
      role: "sales_executive",
      phone: "+91 94310 00002",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Sunil Kumar",
      email: "tech.sunil@vijoypowersolution.com",
      passwordHash: defaultPasswordHash,
      role: "technician",
      phone: "+91 94310 00003",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Amit Srivastava",
      email: "install.amit@vijoypowersolution.com",
      passwordHash: defaultPasswordHash,
      role: "installation_manager",
      phone: "+91 94310 00004",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Priya Sharma",
      email: "editor.priya@vijoypowersolution.com",
      passwordHash: defaultPasswordHash,
      role: "content_editor",
      phone: "+91 94310 00005",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const u of demoUsers) {
    await usersCol.updateOne({ email: u.email }, { $set: u }, { upsert: true });
  }
  console.log("-> 5 Team Members Seeded (Password: Solar@2026Secure!)");

  // Get User IDs for assignments
  const salesRahul = await usersCol.findOne({ email: "sales.rahul@vijoypowersolution.com" });
  const techSunil = await usersCol.findOne({ email: "tech.sunil@vijoypowersolution.com" });
  const installAmit = await usersCol.findOne({ email: "install.amit@vijoypowersolution.com" });
  const superAdmin = await usersCol.findOne({ email: "admin@vijoypowersolution.com" });

  // 2. Demo Leads
  console.log("2. Seeding Multi-Stage Leads for Pipeline & CRM...");
  const leadsCol = db.collection("leads");
  await leadsCol.deleteMany({});

  const now = new Date();
  const demoLeads = [
    {
      leadId: "VPS-LD-1001",
      fullName: "Anand Prakash",
      phone: "9835012345",
      email: "anand.prakash@gmail.com",
      state: "Bihar",
      city: "Patna",
      customerType: "residential",
      solarSolutionType: "Residential Rooftop",
      approximateMonthlyBillInr: 4500,
      monthlyElectricityConsumptionUnits: 550,
      roofType: "RCC (Concrete Terrace)",
      roofAreaSqFt: 350,
      wattagePreference: 550,
      stage: "new",
      priority: "high",
      leadSource: "website_quote_form",
      assignedTo: salesRahul?._id,
      notes: "Customer interested in 3kW to 5kW system for PM Surya Ghar subsidy.",
      isArchived: false,
      createdAt: new Date(now.getTime() - 2 * 3600000),
      updatedAt: new Date(now.getTime() - 2 * 3600000),
    },
    {
      leadId: "VPS-LD-1002",
      fullName: "M/s Maa Sharda Cold Storage",
      phone: "9431198765",
      email: "contact@sharda-coldstorage.com",
      state: "Bihar",
      city: "Muzaffarpur",
      customerType: "commercial",
      solarSolutionType: "Commercial & Industrial (C&I)",
      approximateMonthlyBillInr: 65000,
      monthlyElectricityConsumptionUnits: 7200,
      roofType: "Tin / Metal Shed",
      roofAreaSqFt: 2800,
      wattagePreference: 550,
      stage: "contacted",
      priority: "high",
      leadSource: "whatsapp",
      assignedTo: salesRahul?._id,
      notes: "Heavy daytime refrigeration load. Looking for 50kW On-Grid solar plant.",
      isArchived: false,
      createdAt: new Date(now.getTime() - 24 * 3600000),
      updatedAt: new Date(now.getTime() - 18 * 3600000),
    },
    {
      leadId: "VPS-LD-1003",
      fullName: "Vikash Chandra",
      phone: "9771023456",
      email: "vikash.c@yahoo.com",
      state: "Jharkhand",
      city: "Ranchi",
      customerType: "residential",
      solarSolutionType: "Hybrid Solar System",
      approximateMonthlyBillInr: 3200,
      monthlyElectricityConsumptionUnits: 380,
      roofType: "RCC (Concrete Terrace)",
      roofAreaSqFt: 220,
      wattagePreference: 540,
      stage: "qualified",
      priority: "medium",
      leadSource: "calculator",
      assignedTo: salesRahul?._id,
      notes: "Wants battery backup during power cuts in Morabadi area.",
      isArchived: false,
      createdAt: new Date(now.getTime() - 48 * 3600000),
      updatedAt: new Date(now.getTime() - 12 * 3600000),
    },
    {
      leadId: "VPS-LD-1004",
      fullName: "Dr. Arvind K. Mishra",
      phone: "9430034567",
      email: "dr.mishra.clinic@gmail.com",
      state: "Uttar Pradesh",
      city: "Varanasi",
      customerType: "commercial",
      solarSolutionType: "Commercial & Industrial (C&I)",
      approximateMonthlyBillInr: 14000,
      monthlyElectricityConsumptionUnits: 1600,
      roofType: "RCC (Concrete Terrace)",
      roofAreaSqFt: 850,
      wattagePreference: 550,
      stage: "survey_scheduled",
      priority: "high",
      leadSource: "website_quote_form",
      assignedTo: salesRahul?._id,
      notes: "Clinic rooftop. Site survey scheduled for Thursday 11 AM.",
      isArchived: false,
      createdAt: new Date(now.getTime() - 72 * 3600000),
      updatedAt: new Date(now.getTime() - 6 * 3600000),
    },
    {
      leadId: "VPS-LD-1005",
      fullName: "Rameshwar Singh",
      phone: "9431445678",
      email: "singh.rameshwar@rediffmail.com",
      state: "Bihar",
      city: "Gaya",
      customerType: "residential",
      solarSolutionType: "Residential Rooftop",
      approximateMonthlyBillInr: 2800,
      monthlyElectricityConsumptionUnits: 340,
      roofType: "RCC (Concrete Terrace)",
      roofAreaSqFt: 200,
      wattagePreference: 550,
      stage: "survey_completed",
      priority: "medium",
      leadSource: "direct_call",
      assignedTo: salesRahul?._id,
      notes: "Survey completed by Sunil. Suggested 3kW system. 100% shadow-free.",
      isArchived: false,
      createdAt: new Date(now.getTime() - 96 * 3600000),
      updatedAt: new Date(now.getTime() - 20 * 3600000),
    },
    {
      leadId: "VPS-LD-1006",
      fullName: "Tata Steel Ancillary Unit",
      phone: "9431356789",
      email: "procurement@ancillary-ts.co.in",
      state: "Jharkhand",
      city: "Jamshedpur",
      customerType: "industrial",
      solarSolutionType: "Commercial & Industrial (C&I)",
      approximateMonthlyBillInr: 125000,
      monthlyElectricityConsumptionUnits: 14000,
      roofType: "Tin / Metal Shed",
      roofAreaSqFt: 6500,
      wattagePreference: 580,
      stage: "quotation_sent",
      priority: "high",
      leadSource: "direct_call",
      assignedTo: salesRahul?._id,
      notes: "Formal proposal sent for 100kW plant. Board meeting scheduled next week.",
      isArchived: false,
      createdAt: new Date(now.getTime() - 120 * 3600000),
      updatedAt: new Date(now.getTime() - 10 * 3600000),
    },
    {
      leadId: "VPS-LD-1007",
      fullName: "Sunita Devi",
      phone: "9934067890",
      email: "sunita.devi.patna@gmail.com",
      state: "Bihar",
      city: "Patna",
      customerType: "residential",
      solarSolutionType: "Residential Rooftop",
      approximateMonthlyBillInr: 3600,
      monthlyElectricityConsumptionUnits: 420,
      roofType: "RCC (Concrete Terrace)",
      roofAreaSqFt: 260,
      wattagePreference: 550,
      stage: "negotiation",
      priority: "high",
      leadSource: "website_survey_form",
      assignedTo: salesRahul?._id,
      notes: "Reviewing quote for 3.3kW plant. Wants elevated structure for terrace garden.",
      isArchived: false,
      createdAt: new Date(now.getTime() - 140 * 3600000),
      updatedAt: new Date(now.getTime() - 4 * 3600000),
    },
    {
      leadId: "VPS-LD-1008",
      fullName: "Er. Deepak Kumar",
      phone: "9431878901",
      email: "deepak.engg.patna@gmail.com",
      state: "Bihar",
      city: "Patna",
      customerType: "residential",
      solarSolutionType: "Residential Rooftop",
      approximateMonthlyBillInr: 8200,
      monthlyElectricityConsumptionUnits: 980,
      roofType: "RCC (Concrete Terrace)",
      roofAreaSqFt: 600,
      wattagePreference: 550,
      stage: "won",
      priority: "high",
      leadSource: "website_quote_form",
      assignedTo: salesRahul?._id,
      notes: "Contract signed for 10kW On-Grid. Advance payment received.",
      isArchived: false,
      createdAt: new Date(now.getTime() - 180 * 3600000),
      updatedAt: new Date(now.getTime() - 2 * 3600000),
    },
    {
      leadId: "VPS-LD-1009",
      fullName: "Shree Krishna Sweet & Bakery",
      phone: "9835889012",
      email: "krishna.sweets.gkp@gmail.com",
      state: "Uttar Pradesh",
      city: "Gorakhpur",
      customerType: "commercial",
      solarSolutionType: "Commercial & Industrial (C&I)",
      approximateMonthlyBillInr: 22000,
      monthlyElectricityConsumptionUnits: 2500,
      roofType: "RCC (Concrete Terrace)",
      roofAreaSqFt: 1100,
      wattagePreference: 550,
      stage: "installation_in_progress",
      priority: "high",
      leadSource: "whatsapp",
      assignedTo: salesRahul?._id,
      notes: "Modules mounted. Inverter wiring and net meter application submitted to UPPCL.",
      isArchived: false,
      createdAt: new Date(now.getTime() - 240 * 3600000),
      updatedAt: new Date(now.getTime() - 1 * 3600000),
    },
    {
      leadId: "VPS-LD-1010",
      fullName: "Manoj Tiwary",
      phone: "9430190123",
      email: "manoj.tiwary.dhn@gmail.com",
      state: "Jharkhand",
      city: "Dhanbad",
      customerType: "residential",
      solarSolutionType: "Residential Rooftop",
      approximateMonthlyBillInr: 4100,
      monthlyElectricityConsumptionUnits: 480,
      roofType: "RCC (Concrete Terrace)",
      roofAreaSqFt: 300,
      wattagePreference: 550,
      stage: "completed",
      priority: "medium",
      leadSource: "calculator",
      assignedTo: salesRahul?._id,
      notes: "5kW On-Grid commissioned with bi-directional net meter. Generating ~22 units/day.",
      isArchived: false,
      createdAt: new Date(now.getTime() - 360 * 3600000),
      updatedAt: new Date(now.getTime() - 12 * 3600000),
    },
  ];

  await leadsCol.insertMany(demoLeads);
  console.log(`-> ${demoLeads.length} Leads Seeded across all stages`);

  // Get inserted leads
  const lead1 = await leadsCol.findOne({ leadId: "VPS-LD-1001" });
  const lead2 = await leadsCol.findOne({ leadId: "VPS-LD-1002" });
  const lead4 = await leadsCol.findOne({ leadId: "VPS-LD-1004" });
  const lead5 = await leadsCol.findOne({ leadId: "VPS-LD-1005" });
  const lead6 = await leadsCol.findOne({ leadId: "VPS-LD-1006" });
  const lead8 = await leadsCol.findOne({ leadId: "VPS-LD-1008" });
  const lead9 = await leadsCol.findOne({ leadId: "VPS-LD-1009" });

  // 3. Demo Follow-ups
  console.log("3. Seeding Follow-ups (Today, Overdue, Upcoming)...");
  const followUpCol = db.collection("followups");
  await followUpCol.deleteMany({});

  const demoFollowUps = [
    {
      leadId: lead1?._id,
      assignedTo: salesRahul?._id,
      followUpType: "phone_call",
      status: "due_today",
      scheduledAt: new Date(now.getTime() + 2 * 3600000), // Due Today
      notes: "Follow up with Anand Prakash to confirm exact rooftop dimensions and electricity bill copy.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      leadId: lead2?._id,
      assignedTo: salesRahul?._id,
      followUpType: "whatsapp",
      status: "due_today",
      scheduledAt: new Date(now.getTime() + 4 * 3600000), // Due Today
      notes: "Send technical brochure on 550W Bifacial modules and NBPDCL commercial solar tariff.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      leadId: lead6?._id,
      assignedTo: salesRahul?._id,
      followUpType: "meeting",
      status: "overdue",
      scheduledAt: new Date(now.getTime() - 24 * 3600000), // Overdue
      notes: "Follow up on Board technical review for 100kW CAPEX proposal in Jamshedpur.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      leadId: lead4?._id,
      assignedTo: techSunil?._id,
      followUpType: "site_survey",
      status: "pending",
      scheduledAt: new Date(now.getTime() + 28 * 3600000), // Upcoming Tomorrow
      notes: "On-site shadow analysis with technician Sunil Verma at Varanasi clinic.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await followUpCol.insertMany(demoFollowUps);
  console.log(`-> ${demoFollowUps.length} Follow-ups Seeded`);

  // 4. Demo Site Surveys
  console.log("4. Seeding Site Surveys...");
  const surveysCol = db.collection("sitesurveys");
  await surveysCol.deleteMany({});

  const demoSurveys = [
    {
      surveyId: "VPS-SRV-1001",
      leadId: lead4?._id,
      customerName: "Dr. Arvind K. Mishra",
      customerPhone: "9430034567",
      siteAddress: "Mishra Clinic, Orderly Bazar, Varanasi, UP",
      state: "Uttar Pradesh",
      city: "Varanasi",
      surveyDate: new Date(now.getTime() + 28 * 3600000),
      assignedTechnician: techSunil?._id,
      status: "scheduled",
      feasibilityStatus: "pending_review",
      roofType: "RCC (Concrete Terrace)",
      shadingObservations: "Minimal shading along Northern parapet",
      existingSanctionedLoadKw: 15,
      suggestedSystemCapacityKw: 10,
      sitePhotographs: ["https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&q=80"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      surveyId: "VPS-SRV-1002",
      leadId: lead5?._id,
      customerName: "Rameshwar Singh",
      customerPhone: "9431445678",
      siteAddress: "AP Colony, Gaya, Bihar",
      state: "Bihar",
      city: "Gaya",
      surveyDate: new Date(now.getTime() - 48 * 3600000),
      assignedTechnician: techSunil?._id,
      status: "completed",
      feasibilityStatus: "feasible",
      roofType: "RCC (Concrete Terrace)",
      shadingObservations: "100% Shadow Free southern orientation",
      roofAreaSqFt: 220,
      existingSanctionedLoadKw: 5,
      suggestedSystemCapacityKw: 3.3,
      surveyNotes: "Excellent shadow-free orientation facing South 180 degrees. 3.3kW plant ideal for PM Surya Ghar subsidy.",
      sitePhotographs: ["https://images.unsplash.com/photo-1548337138-e87d889cc369?w=600&q=80"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await surveysCol.insertMany(demoSurveys);
  console.log(`-> ${demoSurveys.length} Site Surveys Seeded`);

  // 5. Demo Quotations
  console.log("5. Seeding Internal Private Quotations...");
  const quotesCol = db.collection("quotations");
  await quotesCol.deleteMany({});

  const demoQuotations = [
    {
      quotationNumber: "VPS-QT-2026-101",
      leadId: lead5?._id,
      customerName: "Rameshwar Singh",
      customerPhone: "9431445678",
      customerEmail: "singh.rameshwar@rediffmail.com",
      installationAddress: "AP Colony, Near Tower, Gaya, Bihar",
      proposedSystemCapacityKw: 3.3,
      solarPanelBrandModel: "Waaree 550W Mono PERC Bifacial",
      solarPanelQuantity: 6,
      inverterBrandModel: "Growatt 3.3kW On-Grid",
      status: "sent",
      lineItems: [
        { description: "6x 550W Waaree Mono PERC Bifacial Modules", quantity: 6, unit: "Nos", unitPrice: 11000, totalPrice: 66000 },
        { description: "1x 3.3kW Growatt/Deye On-Grid Inverter with Wi-Fi", quantity: 1, unit: "Set", unitPrice: 28000, totalPrice: 28000 },
        { description: "Elevated Hot Dip Galvanized Structure & Fasteners", quantity: 1, unit: "Lot", unitPrice: 14000, totalPrice: 14000 },
        { description: "BOS: DCDB, ACDB, Solar DC Cables, Copper Earthing & LA", quantity: 1, unit: "Lot", unitPrice: 16000, totalPrice: 16000 },
        { description: "Turnkey Installation, Testing & SBPDCL Net Metering Commissioning", quantity: 1, unit: "Lot", unitPrice: 16000, totalPrice: 16000 },
      ],
      subtotal: 140000,
      taxGstPercent: 18,
      taxAmount: 25200,
      estimatedSubsidyAmount: 78000,
      netPayableEstimate: 87200,
      termsAndConditions: "20% advance booking, 70% against material delivery, 10% on SBPDCL net meter synchronization.",
      validUntil: new Date(now.getTime() + 30 * 86400000),
      preparedBy: superAdmin?._id,
      createdAt: new Date(now.getTime() - 24 * 3600000),
      updatedAt: new Date(now.getTime() - 24 * 3600000),
    },
    {
      quotationNumber: "VPS-QT-2026-102",
      leadId: lead8?._id,
      customerName: "Er. Deepak Kumar",
      customerPhone: "9431878901",
      customerEmail: "deepak.engg.patna@gmail.com",
      installationAddress: "Kankarbagh Main Road, Patna, Bihar",
      proposedSystemCapacityKw: 10,
      solarPanelBrandModel: "VPS TopCon 550W N-Type Modules",
      solarPanelQuantity: 18,
      inverterBrandModel: "Solis 10kW Three-Phase On-Grid Inverter",
      status: "accepted",
      lineItems: [
        { description: "18x 550W TopCon High Efficiency Solar Modules", quantity: 18, unit: "Nos", unitPrice: 11200, totalPrice: 201600 },
        { description: "1x 10kW Three-Phase On-Grid Inverter with Wi-Fi Logger", quantity: 1, unit: "Set", unitPrice: 62000, totalPrice: 62000 },
        { description: "Super Elevated Galvanized Mounting Structure (10ft clearance)", quantity: 1, unit: "Lot", unitPrice: 52000, totalPrice: 52000 },
        { description: "BOS: ACDB, DCDB, Earthing Rods, Chemical Backfill, LA", quantity: 1, unit: "Lot", unitPrice: 32000, totalPrice: 32000 },
        { description: "EPC Execution, DISCOM Inspection & Bi-directional Net Metering", quantity: 1, unit: "Lot", unitPrice: 32400, totalPrice: 32400 },
      ],
      subtotal: 380000,
      taxGstPercent: 18,
      taxAmount: 68400,
      estimatedSubsidyAmount: 78000,
      netPayableEstimate: 370400,
      termsAndConditions: "15% booking, 75% material dispatch, 10% DISCOM net meter synchronization.",
      validUntil: new Date(now.getTime() + 30 * 86400000),
      preparedBy: superAdmin?._id,
      createdAt: new Date(now.getTime() - 72 * 3600000),
      updatedAt: new Date(now.getTime() - 72 * 3600000),
    },
  ];

  await quotesCol.insertMany(demoQuotations);
  console.log(`-> ${demoQuotations.length} Commercial Quotations Seeded`);

  // 6. Demo Installation Jobs
  console.log("6. Seeding Installation EPC Jobs...");
  const installCol = db.collection("installationjobs");
  await installCol.deleteMany({});

  const demoInstallations = [
    {
      jobId: "VPS-JOB-2026-081",
      leadId: lead8?._id,
      customerName: "Er. Deepak Kumar",
      customerPhone: "9431878901",
      installationAddress: "Kankarbagh Main Road, Patna, Bihar",
      state: "Bihar",
      city: "Patna",
      systemCapacityKw: 10,
      solarPanelBrandModel: "VPS TopCon 550W N-Type",
      solarPanelQuantity: 18,
      inverterBrandModel: "Solis 10kW Three-Phase",
      assignedManager: installAmit?._id,
      leadTechnician: techSunil?._id,
      stage: "materials_procured",
      startDate: new Date(now.getTime() - 72 * 3600000),
      scheduledCompletionDate: new Date(now.getTime() + 96 * 3600000),
      hasCustomerConsentForPortfolio: true,
      convertedToPublicProject: false,
      commissioningChecklistDone: false,
      handoverDocSigned: false,
      customerApprovalReceived: true,
      privateSitePhotos: ["https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&q=80"],
      installationNotes: "Structure delivered. Mounting scheduled for tomorrow morning.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      jobId: "VPS-JOB-2026-082",
      leadId: lead9?._id,
      customerName: "Shree Krishna Sweet & Bakery",
      customerPhone: "9835889012",
      installationAddress: "Medical College Road, Gorakhpur, UP",
      state: "Uttar Pradesh",
      city: "Gorakhpur",
      systemCapacityKw: 12,
      solarPanelBrandModel: "Waaree 550W Mono PERC",
      solarPanelQuantity: 22,
      inverterBrandModel: "Growatt 12kW On-Grid",
      assignedManager: installAmit?._id,
      leadTechnician: techSunil?._id,
      stage: "electrical_inspection",
      startDate: new Date(now.getTime() - 120 * 3600000),
      scheduledCompletionDate: new Date(now.getTime() + 48 * 3600000),
      hasCustomerConsentForPortfolio: true,
      convertedToPublicProject: false,
      commissioningChecklistDone: true,
      handoverDocSigned: false,
      customerApprovalReceived: true,
      privateSitePhotos: ["https://images.unsplash.com/photo-1548337138-e87d889cc369?w=600&q=80"],
      installationNotes: "Inverter wiring and earthing complete. Awaiting UPPCL inspector visit for bi-directional meter.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await installCol.insertMany(demoInstallations);
  console.log(`-> ${demoInstallations.length} Installation Jobs Seeded`);

  // 7. Demo Lead Activities
  console.log("7. Seeding Lead Activity Logs...");
  const actCol = db.collection("leadactivities");
  await actCol.deleteMany({});

  const demoActivities = [
    {
      leadId: lead1?._id,
      activityType: "lead_created",
      title: "Inbound Lead Captured",
      description: "Customer requested 3kW solar consultation via public website enquiry form.",
      createdAt: new Date(now.getTime() - 2 * 3600000),
    },
    {
      leadId: lead1?._id,
      activityType: "lead_assigned",
      title: "Lead Assigned",
      description: "Assigned to sales executive Rahul Verma for initial 5-minute technical qualification.",
      performedBy: superAdmin?._id,
      createdAt: new Date(now.getTime() - 1.5 * 3600000),
    },
    {
      leadId: lead5?._id,
      activityType: "survey_completed",
      title: "Site Survey Completed",
      description: "Sunil Verma inspected RCC terrace in Gaya. Confirmed 220 sq ft usable area. 3.3kW recommended.",
      performedBy: techSunil?._id,
      createdAt: new Date(now.getTime() - 20 * 3600000),
    },
    {
      leadId: lead8?._id,
      activityType: "stage_change",
      title: "Lead Won & Approved",
      description: "Customer signed quotation VPS-QT-2026-102. Transferred to Installation Manager Amit Srivastava.",
      performedBy: superAdmin?._id,
      createdAt: new Date(now.getTime() - 2 * 3600000),
    },
  ];

  await actCol.insertMany(demoActivities);
  console.log(`-> ${demoActivities.length} Lead Activities Seeded`);

  // 8. Demo Testimonials with Verified Consent
  console.log("8. Seeding Approved Testimonials with Verified Consent...");
  const testCol = db.collection("testimonials");
  await testCol.deleteMany({});

  const demoTestimonials = [
    {
      customerName: "Dr. B. K. Sahay",
      customerCity: "Patna",
      customerState: "Bihar",
      systemCapacityKw: 5,
      rating: 5,
      reviewText: "Our monthly electricity bill dropped from ₹7,500 to under ₹400 after installing a 5kW On-Grid plant with VIJOY POWER SOLUTION. Er. Vijoy Kumar and his team handled the entire SBPDCL net-metering approval without any hassle.",
      hasConsentToPublish: true,
      isApproved: true,
      sortOrder: 1,
      createdAt: new Date(),
    },
    {
      customerName: "Rajeev Agarwal",
      customerCity: "Ranchi",
      customerState: "Jharkhand",
      systemCapacityKw: 10,
      rating: 5,
      reviewText: "Installed a 10kW hybrid solar plant for our diagnostic center in Ranchi. The automatic battery changeover is instant, and we haven't faced a single minute of power interruption since commissioning.",
      hasConsentToPublish: true,
      isApproved: true,
      sortOrder: 2,
      createdAt: new Date(),
    },
    {
      customerName: "Sanjay Singhania",
      customerCity: "Varanasi",
      customerState: "Uttar Pradesh",
      systemCapacityKw: 25,
      rating: 5,
      reviewText: "Superb engineering quality and neat cable management on our textile showroom roof. Delivered before deadline and UPPCL net-metering was activated within 3 weeks.",
      hasConsentToPublish: true,
      isApproved: true,
      sortOrder: 3,
      createdAt: new Date(),
    },
    {
      customerName: "Arun Prasad",
      customerCity: "Gaya",
      customerState: "Bihar",
      systemCapacityKw: 3.3,
      rating: 5,
      reviewText: "Received the full ₹78,000 PM Surya Ghar national subsidy credited directly into my SBI account within 40 days of installation. Highly professional solar team in Bihar.",
      hasConsentToPublish: true,
      isApproved: true,
      sortOrder: 4,
      createdAt: new Date(),
    },
  ];

  await testCol.insertMany(demoTestimonials);
  console.log(`-> ${demoTestimonials.length} Verified Testimonials Seeded`);

  // 9. Educational Blog Articles
  console.log("9. Seeding Educational Knowledge Hub Articles...");
  const blogCol = db.collection("blogs");
  await blogCol.deleteMany({});

  const demoBlogs = [
    {
      title: "PM Surya Ghar Muft Bijli Yojana: Complete Subsidy Guide for Bihar (2026)",
      slug: "pm-surya-ghar-subsidy-guide-bihar",
      category: "Subsidy Guides",
      authorName: "Er. Vijoy Kumar",
      coverImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000&q=80",
      excerpt: "Step-by-step guide to applying for up to ₹78,000 national rooftop subsidy through SBPDCL and NBPDCL DISCOM portals in Bihar.",
      content: `## Everything You Need to Know About Solar Rooftop Subsidy in Bihar

Under the national **PM Surya Ghar: Muft Bijli Yojana**, residential electricity consumers in Bihar can drastically reduce their monthly electricity bills while receiving substantial direct financial subsidies.

### Subsidy Slabs
- **1 kW System**: ₹30,000 direct DBT subsidy
- **2 kW System**: ₹60,000 direct DBT subsidy
- **3 kW and Above**: ₹78,000 maximum direct DBT subsidy

### Key Eligibility Requirements
1. Valid SBPDCL (South Bihar) or NBPDCL (North Bihar) domestic consumer electricity connection (LT-D).
2. Unshaded rooftop area (minimum 70-80 sq ft per kW).
3. BIS-approved, ALMM-compliant tier-1 solar modules installed through registered vendors like **VIJOY POWER SOLUTION**.

### How Net Metering Works in Bihar
The surplus solar energy generated by your rooftop panels during the daytime is automatically exported to the electricity grid through a bi-directional smart meter. At the end of the monthly billing cycle, your DISCOM offsets the exported units against your consumption units.`,
      tags: ["pm-surya-ghar", "bihar-solar", "sbpdcl", "nbpdcl", "subsidy"],
      isPublished: true,
      publishedAt: new Date(now.getTime() - 14 * 86400000),
      createdAt: new Date(),
    },
    {
      title: "On-Grid vs Off-Grid vs Hybrid Solar: Which One is Right for You in Jharkhand?",
      slug: "on-grid-vs-off-grid-vs-hybrid-solar-jharkhand",
      category: "Solar Technology",
      authorName: "Er. Vijoy Kumar",
      coverImage: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1000&q=80",
      excerpt: "A practical comparison of solar system types for Ranchi, Jamshedpur, and Dhanbad homeowners and businesses.",
      content: `## Choosing the Ideal Solar Architecture for Jharkhand

With frequent grid fluctuations and severe summer peak tariffs, choosing the correct solar configuration is critical for maximizing both reliability and financial return.

### 1. On-Grid Solar Plant
- **Best for**: Urban areas with reliable grid availability (Ranchi, Jamshedpur).
- **Advantage**: Lowest capital cost per kW, zero battery maintenance, 100% net metering export.

### 2. Hybrid Solar Plant
- **Best for**: Areas experiencing 2 to 4 hours of daily load shedding or voltage swings.
- **Advantage**: You get net metering bill reduction PLUS continuous battery backup during blackouts.

### 3. Off-Grid Solar Plant
- **Best for**: Remote farmhouses, petrol pumps, and agricultural locations with no electricity grid connection.`,
      tags: ["solar-types", "hybrid-solar", "jharkhand", "jbvnl", "ranchi"],
      isPublished: true,
      publishedAt: new Date(now.getTime() - 7 * 86400000),
      createdAt: new Date(),
    },
    {
      title: "Why 550W+ TOPCon Bifacial Panels are Dominating Modern Rooftop Installations",
      slug: "why-topcon-bifacial-modules-dominate",
      category: "Solar Technology",
      authorName: "Er. Vijoy Kumar",
      coverImage: "https://images.unsplash.com/photo-1548337138-e87d889cc369?w=1000&q=80",
      excerpt: "How N-type TOPCon technology achieves up to 22.5% efficiency and better generation under high ambient temperatures in Eastern India.",
      content: `## The Technology Shift from P-Type to N-Type TOPCon

In the extreme heat of Uttar Pradesh, Bihar, and Jharkhand summer months (often exceeding 43°C), conventional polycrystalline and older P-type mono panels suffer significant power degradation.

### Key Advantages of N-Type TOPCon Solar Modules
1. **Lower Temperature Coefficient (-0.30%/°C)**: Generates significantly more units on hot sunny afternoons.
2. **Bifacial Generation Gain**: Generates an extra 10% to 25% power from reflected ground/terrace albedo light on the rear glass surface.
3. **Virtually Zero LID (Light Induced Degradation)**: Longer lifespan with 30-year performance warranties.`,
      tags: ["topcon", "bifacial", "solar-efficiency", "technology"],
      isPublished: true,
      publishedAt: new Date(now.getTime() - 2 * 86400000),
      createdAt: new Date(),
    },
  ];

  await blogCol.insertMany(demoBlogs);
  console.log(`-> ${demoBlogs.length} Educational Articles Seeded`);

  // 10. Audit Logs
  console.log("10. Seeding System Audit Trail Logs...");
  const auditCol = db.collection("auditlogs");
  await auditCol.deleteMany({});

  const demoAuditLogs = [
    {
      action: "PLATFORM_INITIALIZED",
      userName: "Er. Vijoy Kumar",
      userRole: "super_admin",
      entityType: "Platform Security",
      ipAddress: "127.0.0.1",
      createdAt: new Date(now.getTime() - 10 * 86400000),
    },
    {
      action: "USER_LOGIN",
      userName: "Er. Vijoy Kumar",
      userRole: "super_admin",
      entityType: "User Session",
      ipAddress: "127.0.0.1",
      createdAt: new Date(now.getTime() - 2 * 3600000),
    },
    {
      action: "LEAD_STAGE_UPDATED",
      userName: "Rahul Verma",
      userRole: "sales_executive",
      entityType: "Lead VPS-LD-1008 -> Won",
      ipAddress: "127.0.0.1",
      createdAt: new Date(now.getTime() - 1 * 3600000),
    },
    {
      action: "QUOTATION_DISPATCHED",
      userName: "R. P. Singh",
      userRole: "sales_manager",
      entityType: "Quotation VPS-QT-2026-101 (₹1,65,200)",
      ipAddress: "127.0.0.1",
      createdAt: new Date(now.getTime() - 24 * 3600000),
    },
  ];

  await auditCol.insertMany(demoAuditLogs);
  console.log(`-> ${demoAuditLogs.length} Security Audit Logs Seeded`);

  console.log("\n========================================================");
  console.log("ALL DEMO DATA SUCCESSFULLY SEEDED INTO MONGODB ATLAS!");
  console.log("========================================================");
  console.log("Log in with Super Admin or any seeded team member:");
  console.log("Super Admin: admin@vijoypowersolution.com | Admin@VPS2026SolarSecure!");
  console.log("Sales Manager: sales.mgr@vijoypowersolution.com | Solar@2026Secure!");
  console.log("Sales Executive: sales.rahul@vijoypowersolution.com | Solar@2026Secure!");
  console.log("Technician: tech.sunil@vijoypowersolution.com | Solar@2026Secure!");
  console.log("Installation Manager: install.amit@vijoypowersolution.com | Solar@2026Secure!");
  console.log("========================================================");

  await mongoose.disconnect();
}

seedDemoData().catch((err) => {
  console.error("Demo seeding failed:", err);
  process.exit(1);
});

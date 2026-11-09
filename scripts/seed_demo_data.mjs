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
  console.log("===============================================================");
  console.log("VIJOY POWER SOLUTION — 100% COMPLETE DEMO DATA SEEDER");
  console.log("Connecting to MongoDB Atlas:", MONGODB_URI.replace(/:[^:@]+@/, ":***@"));
  console.log("===============================================================");

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const now = new Date();

  // 1. Super Admin & Staff Team Members
  console.log("\n[1/12] Seeding Super Admin & Role-Based Team Members...");
  const usersCol = db.collection("users");
  const defaultPasswordHash = await bcrypt.hash("Solar@2026Secure!", 12);
  const adminPasswordHash = await bcrypt.hash("Admin@VPS2026SolarSecure!", 12);

  const teamMembers = [
    {
      name: "Er. Vijoy Kumar",
      email: "admin@vijoypowersolution.com",
      passwordHash: adminPasswordHash,
      role: "super_admin",
      phone: "+91 94310 00000",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
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

  for (const u of teamMembers) {
    await usersCol.updateOne({ email: u.email }, { $set: u }, { upsert: true });
  }
  console.log(`-> ${teamMembers.length} Staff accounts configured (Admin & RBAC roles)`);

  const superAdmin = await usersCol.findOne({ email: "admin@vijoypowersolution.com" });
  const salesRahul = await usersCol.findOne({ email: "sales.rahul@vijoypowersolution.com" });
  const techSunil = await usersCol.findOne({ email: "tech.sunil@vijoypowersolution.com" });
  const installAmit = await usersCol.findOne({ email: "install.amit@vijoypowersolution.com" });

  // 2. Product Categories (12 Categories)
  console.log("\n[2/12] Seeding 12 Product Categories...");
  const catCol = db.collection("productcategories");
  await catCol.deleteMany({});
  const demoCategories = [
    { name: "Mono PERC Solar Panels", slug: "mono-perc-solar-panels", description: "High-efficiency monocrystalline passivated emitter rear contact panels.", sortOrder: 1, isActive: true },
    { name: "Bifacial Solar Panels", slug: "bifacial-solar-panels", description: "Dual-glass modules capturing both direct sunlight and ground reflected albedo.", sortOrder: 2, isActive: true },
    { name: "N-Type TOPCon Panels", slug: "n-type-topcon-panels", description: "Next-generation solar technology with ultra-low thermal degradation for Indian heat.", sortOrder: 3, isActive: true },
    { name: "HJT Heterojunction Panels", slug: "hjt-heterojunction-panels", description: "Premium solar cells combining crystalline and amorphous silicon for >22.5% efficiency.", sortOrder: 4, isActive: true },
    { name: "Polycrystalline Solar Panels", slug: "polycrystalline-solar-panels", description: "Economical multi-crystalline panels for budget agricultural and off-grid setups.", sortOrder: 5, isActive: true },
    { name: "Small-Wattage DC Modules (10W-100W)", slug: "small-wattage-dc-modules", description: "Compact solar modules for street lighting, CCTV, rural lighting and fencing.", sortOrder: 6, isActive: true },
    { name: "On-Grid Inverters", slug: "on-grid-inverters", description: "Grid-tie string inverters for DISCOM net-metering synchronization.", sortOrder: 7, isActive: true },
    { name: "Hybrid Inverters with Storage", slug: "hybrid-inverters", description: "Smart bi-directional inverters managing solar, battery storage, and utility grid.", sortOrder: 8, isActive: true },
    { name: "Lithium Solar Batteries (LiFePO4)", slug: "lithium-solar-batteries", description: "High-cycle deep-discharge lithium iron phosphate battery banks.", sortOrder: 9, isActive: true },
    { name: "Tubular Solar Lead-Acid Batteries", slug: "tubular-solar-batteries", description: "Heavy-duty C10 rated tall tubular batteries engineered for Indian climates.", sortOrder: 10, isActive: true },
    { name: "Elevated Galvanized Structures", slug: "mounting-structures", description: "Hot-dip galvanized (80+ micron) mounting structures with wind resistance up to 170 km/h.", sortOrder: 11, isActive: true },
    { name: "Solar Water Pumping Systems", slug: "solar-water-pumping-systems", description: "Solar VFD controllers and submersible AC/DC pumps for agricultural borewells.", sortOrder: 12, isActive: true },
  ];
  await catCol.insertMany(demoCategories.map(c => ({ ...c, createdAt: now, updatedAt: now })));
  console.log(`-> ${demoCategories.length} Categories seeded`);

  // 3. Solar Products (21 Wattage Tiers from 10W to 730W)
  console.log("\n[3/12] Seeding 21 Solar Panel Products (10W to 730W Strictly Compliant)...");
  const prodCol = db.collection("solarproducts");
  await prodCol.deleteMany({});

  const wattageTiers = [
    { watt: 10, brand: "Loom Solar", model: "LS-10W-MONO", group: "10W-50W", eff: 15.5, cell: 36, dim: "350 x 280 x 20 mm", wt: 1.2, app: "Solar CCTV, garden lights, IoT sensor units" },
    { watt: 20, brand: "Loom Solar", model: "LS-20W-MONO", group: "10W-50W", eff: 16.5, cell: 36, dim: "485 x 350 x 25 mm", wt: 2.1, app: "Street lights, small 12V battery charging" },
    { watt: 40, brand: "Waaree", model: "WAA-40-POLY", group: "10W-50W", eff: 15.0, cell: 36, dim: "540 x 480 x 25 mm", wt: 3.5, app: "Rural lighting kits, 12V DC fans" },
    { watt: 50, brand: "Waaree", model: "WAA-50-POLY", group: "10W-50W", eff: 15.2, cell: 36, dim: "665 x 540 x 30 mm", wt: 4.5, app: "Village shops, small 12V battery backup" },
    { watt: 75, brand: "Vikram Solar", model: "VS-75-POLY", group: "51W-100W", eff: 16.2, cell: 36, dim: "820 x 540 x 30 mm", wt: 5.8, app: "DC refrigeration, rural health camps" },
    { watt: 100, brand: "Vikram Solar", model: "VS-100-PERC", group: "51W-100W", eff: 18.4, cell: 36, dim: "1005 x 670 x 30 mm", wt: 7.2, app: "Single battery home inverters, small shops" },
    { watt: 150, brand: "Tata Power Solar", model: "TPS-150-MONO", group: "101W-200W", eff: 18.9, cell: 36, dim: "1480 x 670 x 30 mm", wt: 9.8, app: "Home lighting & TV back-up systems" },
    { watt: 200, brand: "Tata Power Solar", model: "TPS-200-PERC", group: "101W-200W", eff: 19.5, cell: 72, dim: "1480 x 670 x 35 mm", wt: 11.2, app: "24V battery systems, clinic backups" },
    { watt: 250, brand: "Loom Solar", model: "LS-SHARK-250", group: "201W-300W", eff: 20.4, cell: 72, dim: "1550 x 700 x 35 mm", wt: 13.5, app: "Residential off-grid, farm houses" },
    { watt: 300, brand: "Vikram Solar", model: "VS-SOMERA-300", group: "201W-300W", eff: 19.8, cell: 60, dim: "1650 x 992 x 35 mm", wt: 18.0, app: "Rooftop On-Grid 3kW residential systems" },
    { watt: 335, brand: "Waaree", model: "WAA-ADITYA-335", group: "301W-400W", eff: 20.1, cell: 72, dim: "1960 x 992 x 35 mm", wt: 21.5, app: "Schools, commercial establishments" },
    { watt: 400, brand: "Adani Solar", model: "AS-ELAN-400", group: "301W-400W", eff: 20.8, cell: 108, dim: "1722 x 1134 x 30 mm", wt: 20.8, app: "Modern residential compact rooftop plants" },
    { watt: 450, brand: "Goldi Solar", model: "GOLD-450-PERC", group: "401W-500W", eff: 21.0, cell: 120, dim: "1910 x 1134 x 35 mm", wt: 23.5, app: "Commercial buildings, institutional rooftops" },
    { watt: 500, brand: "Vikram Solar", model: "VS-PARIKSHIT-500", group: "401W-500W", eff: 21.3, cell: 132, dim: "2094 x 1134 x 35 mm", wt: 25.5, app: "PM Surya Ghar 3.3kW to 5kW systems" },
    { watt: 540, brand: "Tata Power Solar", model: "TPS-TP-540-BIFI", group: "501W-600W", eff: 21.5, cell: 144, dim: "2278 x 1134 x 35 mm", wt: 27.5, app: "Bifacial residential & institutional arrays" },
    { watt: 550, brand: "Waaree", model: "WAA-ARKA-550", group: "501W-600W", eff: 21.7, cell: 144, dim: "2278 x 1134 x 35 mm", wt: 28.0, app: "Most popular 3kW/5kW/10kW rooftop choice" },
    { watt: 580, brand: "Loom Solar", model: "LS-TOPCON-580", group: "501W-600W", eff: 22.4, cell: 144, dim: "2278 x 1134 x 35 mm", wt: 28.2, app: "High-efficiency N-Type TOPCon rooftops" },
    { watt: 600, brand: "Adani Solar", model: "AS-PRATHAM-600", group: "501W-600W", eff: 22.1, cell: 120, dim: "2172 x 1303 x 35 mm", wt: 31.0, app: "Industrial factories, cold storages, rice mills" },
    { watt: 650, brand: "Goldi Solar", model: "GOLD-HELIOC-650", group: "601W-700W", eff: 22.3, cell: 132, dim: "2384 x 1303 x 35 mm", wt: 34.0, app: "Large commercial & industrial megawatt plants" },
    { watt: 700, brand: "Vikram Solar", model: "VS-SURYAVA-700", group: "601W-700W", eff: 22.8, cell: 132, dim: "2384 x 1303 x 35 mm", wt: 34.5, app: "Captive ground mounted & heavy C&I plants" },
    { watt: 730, brand: "VPS Engineered", model: "VPS-HJT-ULTRA-730", group: "701W-730W", eff: 23.5, cell: 132, dim: "2384 x 1303 x 35 mm", wt: 35.0, app: "Maximum power density HJT bifacial EPC projects" },
  ];

  const demoProducts = wattageTiers.map((p, idx) => ({
    productId: `VPS-PRD-${1001 + idx}`,
    name: `${p.watt}W ${p.brand} ${p.watt >= 540 ? "Bifacial" : "High Efficiency"} Solar Module`,
    slug: `${p.watt}w-${p.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-solar-module`,
    brand: p.brand,
    modelNumber: p.model,
    ratedPowerWp: p.watt,
    technologyCategories: p.watt >= 580 ? ["N-Type TOPCon Panels", "Bifacial Solar Panels"] : p.watt >= 500 ? ["Mono PERC Solar Panels", "Bifacial Solar Panels"] : ["Mono PERC Solar Panels"],
    wattageGroup: p.group,
    moduleEfficiencyPercent: p.eff,
    cellCount: p.cell,
    dimensionsMm: p.dim,
    weightKg: p.wt,
    maxSystemVoltageV: p.watt >= 400 ? 1500 : 1000,
    openCircuitVoltageVoc: Number((p.watt * 0.088 + 18).toFixed(1)),
    optOperatingVoltageVmp: Number((p.watt * 0.074 + 15).toFixed(1)),
    shortCircuitCurrentIsc: Number((p.watt / 42).toFixed(2)),
    optOperatingCurrentImp: Number((p.watt / 46).toFixed(2)),
    temperatureCoefficientPmax: p.watt >= 580 ? "-0.30% / °C" : "-0.35% / °C",
    certifications: ["IEC 61215", "IEC 61730", "BIS", "ALMM Compliant"],
    productWarrantyYears: 12,
    performanceWarrantyYears: 25,
    coverImage: p.watt >= 500 ? "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80" : "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&q=80",
    galleryImages: [],
    keyFeatures: [
      "ALMM Listed & MNRE approved for Indian DISCOM net metering",
      "Tier-1 manufacturing with strict electroluminescence testing",
      "Heavy-duty corrosion-resistant anodized aluminum alloy frame",
      "Optimized for high-temperature Eastern India operating environments"
    ],
    typicalApplications: [p.app, "Eligible for PM Surya Ghar rooftop solar projects"],
    description: `Engineered ${p.watt}W solar panel offering ${p.eff}% module efficiency. Designed for residential, commercial, and utility installations across Bihar, Jharkhand, and Uttar Pradesh.`,
    availabilityStatus: "in_stock",
    isFeatured: [10, 100, 335, 540, 550, 580, 700, 730].includes(p.watt),
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  }));

  await prodCol.insertMany(demoProducts);
  console.log(`-> ${demoProducts.length} Solar Products Seeded (Strict range 10W - 730W verified)`);

  // 4. Solar Services (15 Services)
  console.log("\n[4/12] Seeding 15 Solar Engineering Services...");
  const servCol = db.collection("solarservices");
  await servCol.deleteMany({});
  const demoServices = [
    { title: "Residential Rooftop Solar EPC", slug: "residential-rooftop-solar-epc", shortDescription: "Complete turnkey solar installation for independent houses, villas, and housing societies.", fullDescription: "From shadow analysis and structural civil engineering to DISCOM meter sync and subsidy processing.", benefits: ["Cut 80-90% electricity bills", "PM Surya Ghar subsidy up to ₹78,000", "25-year linear performance warranty"], suitableCustomers: ["Homeowners", "Villas", "Apartments"], supportedSystemTypes: ["On-Grid", "Hybrid"], sortOrder: 1 },
    { title: "Commercial & Industrial Solar EPC", slug: "commercial-industrial-solar-epc", shortDescription: "High-yield captive solar plants for factories, showrooms, hotels, and educational campuses.", fullDescription: "Engineered to drastically cut peak daytime industrial tariffs with accelerated depreciation tax benefits.", benefits: ["Lower OPEX costs", "Tax incentives (Section 32)", "Payback in 3-4 years"], suitableCustomers: ["Hospitals", "Colleges", "Factories", "Hotels"], supportedSystemTypes: ["On-Grid", "HT Synchronized"], sortOrder: 2 },
    { title: "Agricultural Solar Water Pumping", slug: "agricultural-solar-water-pumping", shortDescription: "Heavy-duty solar VFD pumps for borewells, canals, and farm irrigation.", fullDescription: "Zero-diesel agricultural pumping solutions providing reliable day-time irrigation across rural farms.", benefits: ["Zero fuel cost", "Automatic dry-run protection", "High water discharge"], suitableCustomers: ["Farmers", "Agro Units", "Poultry"], supportedSystemTypes: ["Off-Grid DC/AC"], sortOrder: 3 },
    { title: "Solar Site Survey & 3D Shadow Analysis", slug: "solar-site-survey-shadow-analysis", shortDescription: "Accurate drone and physical site survey to assess azimuth, tilt, and roof obstacles.", fullDescription: "Our certified technicians conduct millimeter-accurate structural and sun-path evaluations.", benefits: ["No shadow surprises", "Accurate generation simulation", "Structural weight certification"], suitableCustomers: ["All Clients"], supportedSystemTypes: ["All"], sortOrder: 4 },
    { title: "DISCOM Net Metering Liaison", slug: "discom-net-metering-liaison", shortDescription: "End-to-end paperwork, inspection coordination, and bi-directional smart meter synchronization.", fullDescription: "Direct liaising with SBPDCL, NBPDCL, JBVNL, and UPPCL authorities for swift approval.", benefits: ["Zero paperwork headache", "Official regulatory compliance", "Smooth monthly billing credits"], suitableCustomers: ["Rooftop Clients"], supportedSystemTypes: ["On-Grid"], sortOrder: 5 },
    { title: "PM Surya Ghar Subsidy Documentation", slug: "pm-surya-ghar-subsidy-documentation", shortDescription: "Comprehensive assistance for national rooftop solar portal registrations.", fullDescription: "Direct bank transfer (DBT) subsidy tracking through to final inspection and sanction.", benefits: ["Direct ₹78,000 DBT", "Authorized vendor compliance", "Transparent updates"], suitableCustomers: ["Residential"], supportedSystemTypes: ["On-Grid"], sortOrder: 6 },
    { title: "Solar Panel Cleaning & Maintenance (O&M)", slug: "solar-panel-cleaning-maintenance", shortDescription: "Professional de-ionized water washing and seasonal soiling mitigation.", fullDescription: "Routine thermal scans and dust removal to maintain 100% peak generation.", benefits: ["15-20% generation boost", "Anti-scratch micro-fiber brushes", "Hotspot prevention"], suitableCustomers: ["Residential", "Commercial"], supportedSystemTypes: ["All"], sortOrder: 7 },
    { title: "Inverter Health Check & Annual AMC", slug: "inverter-health-check-amc", shortDescription: "Comprehensive electronics diagnostics, firmware updates, and string testing.", fullDescription: "Scheduled quarterly preventive checks to maximize equipment lifespan.", benefits: ["Rapid emergency response", "Original spare parts", "Cloud remote monitoring"], suitableCustomers: ["All Clients"], supportedSystemTypes: ["All"], sortOrder: 8 },
    { title: "Elevated Solar Pergola Installation", slug: "elevated-solar-pergola-installation", shortDescription: "10-foot super-elevated structures preserving 100% terrace usable area.", fullDescription: "Architecturally appealing canopy frames ideal for terrace gardens and recreational rooftops.", benefits: ["Usable rooftop area retained", "Weather shelter & cooling", "Hot-dip galvanized steel"], suitableCustomers: ["Homeowners", "Hotels"], supportedSystemTypes: ["On-Grid", "Hybrid"], sortOrder: 9 },
    { title: "Battery Energy Storage Retrofits (BESS)", slug: "battery-energy-storage-retrofits", shortDescription: "Add lithium LiFePO4 or tubular battery storage to existing on-grid systems.", fullDescription: "Transform standard daytime solar setups into 24/7 blackout-proof energy stations.", benefits: ["Instant blackout backup", "Solar self-consumption", "Long-life lithium cells"], suitableCustomers: ["Clinics", "Homes", "Offices"], supportedSystemTypes: ["Hybrid"], sortOrder: 10 },
    { title: "Off-Grid Solar Solutions for Remote Areas", slug: "off-grid-solar-solutions", shortDescription: "Stand-alone micro-grid setups with heavy battery banks for off-grid sites.", fullDescription: "Engineered for petrol pumps, rural clinics, farmhouses, and telecom towers.", benefits: ["Total grid independence", "Clean silent alternative to diesel", "Continuous 24/7 power"], suitableCustomers: ["Rural Homes", "Petrol Pumps"], supportedSystemTypes: ["Off-Grid"], sortOrder: 11 },
    { title: "Ground-Mounted Captive Solar EPC", slug: "ground-mounted-captive-solar-epc", shortDescription: "Megawatt and sub-megawatt ground installations for industrial campuses.", fullDescription: "Engineered pile foundation, heavy MMS structures, central or string inverters.", benefits: ["Scale economies", "Highest generation output", "Direct HT connection"], suitableCustomers: ["Industries", "Institutions"], supportedSystemTypes: ["Captive HT"], sortOrder: 12 },
    { title: "Cold Storage Solar Solutions", slug: "cold-storage-solar-solutions", shortDescription: "High-capacity captive solar systems optimized for daytime refrigeration loads.", fullDescription: "Synchronized with multi-compressor cold storage units in Muzaffarpur, Gaya, and Ranchi.", benefits: ["Saves massive daytime peak units", "Seamless DG synchronization", "Heavy duty bifacial arrays"], suitableCustomers: ["Cold Storages"], supportedSystemTypes: ["Commercial On-Grid"], sortOrder: 13 },
    { title: "Energy Audit & Load Optimization", slug: "energy-audit-load-optimization", shortDescription: "Detailed power quality analysis, harmonic suppression, and power factor tuning.", fullDescription: "Ensure your commercial facility maximizes every kilowatt-hour harvested from rooftop solar.", benefits: ["Reduced maximum demand penalties", "Clean power quality", "Longer appliance lifespan"], suitableCustomers: ["Commercial", "Industrial"], supportedSystemTypes: ["All"], sortOrder: 14 },
    { title: "Third-Party Solar Inspection & Revamping", slug: "third-party-solar-inspection-revamping", shortDescription: "Performance diagnostics and repowering for underperforming older solar plants.", fullDescription: "Rewiring, bypass diode replacement, string re-matching, and inverter upgrades.", benefits: ["Revive dormant capacity", "Fix structural defects", "Resolve tripping issues"], suitableCustomers: ["Existing Solar Owners"], supportedSystemTypes: ["All"], sortOrder: 15 },
  ];

  await servCol.insertMany(demoServices.map(s => ({
    ...s,
    processSteps: [
      { stepNumber: 1, title: "Requirement Gathering", description: "Consultation and bill review" },
      { stepNumber: 2, title: "Technical Survey", description: "Detailed structural & solar analysis" },
      { stepNumber: 3, title: "Engineering & Procurement", description: "Tier-1 ALMM equipment dispatch" },
      { stepNumber: 4, title: "Installation & Commissioning", description: "Safe execution & DISCOM net-meter sync" },
    ],
    serviceableStates: ["Bihar", "Jharkhand", "Uttar Pradesh"],
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&q=80",
    isAvailable: true,
    isFeatured: s.sortOrder <= 6,
    createdAt: now,
    updatedAt: now,
  })));
  console.log(`-> ${demoServices.length} Solar Services Seeded`);

  // 5. Solar Solutions (12 Solutions)
  console.log("\n[5/12] Seeding 12 Solar Solutions...");
  const solCol = db.collection("solarsolutions");
  await solCol.deleteMany({});
  const demoSolutions = [
    { title: "Residential Rooftop Solar", slug: "residential-rooftop-solar", category: "Residential", tagline: "Zero electricity bills and 25 years of clean solar power for your home.", typicalCapacityRange: "1 kW – 10 kW", sortOrder: 1 },
    { title: "Commercial & Institutional Solar", slug: "commercial-institutional-solar", category: "Commercial", tagline: "Slash operating costs for schools, hospitals, and commercial establishments.", typicalCapacityRange: "10 kW – 100 kW", sortOrder: 2 },
    { title: "Industrial Solar Power Plants", slug: "industrial-solar-power-plants", category: "Industrial", tagline: "Heavy-duty captive solar power systems for factories, mills, and warehouses.", typicalCapacityRange: "50 kW – 500+ kW", sortOrder: 3 },
    { title: "On-Grid Net Metering Systems", slug: "on-grid-net-metering-systems", category: "On-Grid", tagline: "Export surplus power to the electricity board and earn monthly billing credits.", typicalCapacityRange: "2 kW – 50 kW", sortOrder: 4 },
    { title: "Off-Grid & Hybrid Solar with Storage", slug: "off-grid-hybrid-solar", category: "Off-Grid", tagline: "Continuous, uninterrupted power even during prolonged utility blackouts.", typicalCapacityRange: "1 kW – 20 kW", sortOrder: 5 },
    { title: "Solar Agricultural Water Pumping", slug: "solar-agricultural-water-pumping", category: "Agricultural", tagline: "Diesel-free irrigation powered by dependable high-efficiency solar VFD pumps.", typicalCapacityRange: "3 HP – 10 HP", sortOrder: 6 },
    { title: "Solar Solutions for Petrol Pumps", slug: "solar-petrol-pumps", category: "Commercial", tagline: "Continuous dispensing operation without expensive diesel generator running costs.", typicalCapacityRange: "5 kW – 15 kW", sortOrder: 7 },
    { title: "Hospital & Healthcare Solar Systems", slug: "hospital-healthcare-solar", category: "Commercial", tagline: "Clean, ultra-reliable uninterrupted solar power for life-saving medical equipment.", typicalCapacityRange: "15 kW – 75 kW", sortOrder: 8 },
    { title: "Educational Institutions & Universities", slug: "educational-institutions-solar", category: "Institutional", tagline: "Lower campus energy budgets while providing live renewable education for students.", typicalCapacityRange: "20 kW – 150 kW", sortOrder: 9 },
    { title: "Cold Storage Captive Solar Plants", slug: "cold-storage-solar-plants", category: "Industrial", tagline: "Offset peak summer daytime refrigeration loads with heavy bifacial arrays.", typicalCapacityRange: "50 kW – 250 kW", sortOrder: 10 },
    { title: "High-Rise Residential Societies (RWA)", slug: "residential-societies-rwa", category: "Residential", tagline: "Power common area lighting, lifts, water pumps, and clubhouse amenities.", typicalCapacityRange: "25 kW – 100 kW", sortOrder: 11 },
    { title: "Rooftop Solar with Elevated Pergola", slug: "elevated-pergola-solar", category: "Residential", tagline: "Maintain complete terrace usability for gardens and walking while generating solar.", typicalCapacityRange: "3 kW – 15 kW", sortOrder: 12 },
  ];

  await solCol.insertMany(demoSolutions.map(s => ({
    ...s,
    description: `Comprehensive solar engineering solution tailored for ${s.category.toLowerCase()} applications in Bihar, Jharkhand, and Uttar Pradesh.`,
    keyBenefits: ["Save 70-90% on electricity expenses", "Tier-1 ALMM compliant equipment", "Full DISCOM net-metering approvals", "25-year performance warranty"],
    suitableFor: ["Independent buildings", "Commercial units", "Farms & enterprises"],
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&q=80",
    isFeatured: s.sortOrder <= 6,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  })));
  console.log(`-> ${demoSolutions.length} Solar Solutions Seeded`);

  // 6. Portfolio Projects (9 Verified Projects: 3 Bihar, 3 Jharkhand, 3 UP)
  console.log("\n[6/12] Seeding 9 Verified Portfolio Projects with Consent Flags...");
  const projCol = db.collection("portfolioprojects");
  await projCol.deleteMany({});

  const demoProjects = [
    // Bihar
    { projectId: "VPS-PRJ-2026-001", title: "10 kW Residential On-Grid Rooftop in Kankarbagh", slug: "10kw-residential-rooftop-patna", state: "Bihar", city: "Patna", generalLocation: "Kankarbagh, Patna, Bihar", systemCapacityKw: 10, panelWattageWp: 550, panelBrandModel: "Waaree 550W Mono PERC", systemCategory: "Residential Rooftop", installationType: "Elevated Hot-Dip Galvanized Structure", completionDate: new Date(now.getTime() - 45 * 86400000) },
    { projectId: "VPS-PRJ-2026-002", title: "25 kW Commercial Solar Plant at Cold Chain Facility", slug: "25kw-commercial-solar-gaya", state: "Bihar", city: "Gaya", generalLocation: "AP Colony Industrial Area, Gaya, Bihar", systemCapacityKw: 25, panelWattageWp: 550, panelBrandModel: "VPS TopCon 550W N-Type", systemCategory: "Commercial & Industrial (C&I)", installationType: "RCC Ballast Mounted Structure", completionDate: new Date(now.getTime() - 90 * 86400000) },
    { projectId: "VPS-PRJ-2026-003", title: "5 kW PM Surya Ghar Rooftop in Muzaffarpur", slug: "5kw-pm-surya-ghar-muzaffarpur", state: "Bihar", city: "Muzaffarpur", generalLocation: "Brahmpura, Muzaffarpur, Bihar", systemCapacityKw: 5, panelWattageWp: 540, panelBrandModel: "Tata Power Solar 540W Bifacial", systemCategory: "Residential Rooftop", installationType: "Standard South-Facing Flush Mount", completionDate: new Date(now.getTime() - 25 * 86400000) },

    // Jharkhand
    { projectId: "VPS-PRJ-2026-004", title: "15 kW Hybrid Solar Plant with Lithium Storage", slug: "15kw-hybrid-solar-ranchi", state: "Jharkhand", city: "Ranchi", generalLocation: "Morabadi, Ranchi, Jharkhand", systemCapacityKw: 15, panelWattageWp: 580, panelBrandModel: "Loom Solar 580W TOPCon", systemCategory: "Hybrid Solar System", installationType: "Elevated Galvanized Terrace Mount", completionDate: new Date(now.getTime() - 60 * 86400000) },
    { projectId: "VPS-PRJ-2026-005", title: "50 kW Industrial Rooftop at Steel Fabrication Plant", slug: "50kw-industrial-solar-jamshedpur", state: "Jharkhand", city: "Jamshedpur", generalLocation: "Adityapur Industrial Area, Jamshedpur", systemCapacityKw: 50, panelWattageWp: 550, panelBrandModel: "Waaree 550W Mono PERC", systemCategory: "Commercial & Industrial (C&I)", installationType: "Tin Shed Trapezoidal Rail System", completionDate: new Date(now.getTime() - 110 * 86400000) },
    { projectId: "VPS-PRJ-2026-006", title: "3.3 kW Residential Solar Plant in Dhanbad", slug: "3kw-residential-solar-dhanbad", state: "Jharkhand", city: "Dhanbad", generalLocation: "Saraidhela, Dhanbad, Jharkhand", systemCapacityKw: 3.3, panelWattageWp: 550, panelBrandModel: "Vikram Solar 550W PERC", systemCategory: "Residential Rooftop", installationType: "Elevated Super Structure", completionDate: new Date(now.getTime() - 35 * 86400000) },

    // Uttar Pradesh
    { projectId: "VPS-PRJ-2026-007", title: "20 kW Healthcare Solar Installation in Varanasi", slug: "20kw-hospital-solar-varanasi", state: "Uttar Pradesh", city: "Varanasi", generalLocation: "Orderly Bazar, Varanasi, UP", systemCapacityKw: 20, panelWattageWp: 550, panelBrandModel: "Adani Solar 550W Bifacial", systemCategory: "Commercial & Industrial (C&I)", installationType: "Custom Dual-Tilt Elevated Pergola", completionDate: new Date(now.getTime() - 80 * 86400000) },
    { projectId: "VPS-PRJ-2026-008", title: "40 kW Commercial Complex Rooftop in Lucknow", slug: "40kw-commercial-solar-lucknow", state: "Uttar Pradesh", city: "Lucknow", generalLocation: "Gomti Nagar, Lucknow, UP", systemCapacityKw: 40, panelWattageWp: 580, panelBrandModel: "Loom Solar 580W TOPCon", systemCategory: "Commercial & Industrial (C&I)", installationType: "Elevated Hot-Dip Galvanized Framing", completionDate: new Date(now.getTime() - 130 * 86400000) },
    { projectId: "VPS-PRJ-2026-009", title: "12 kW Dairy Farm Off-Grid Solar Setup in Gorakhpur", slug: "12kw-dairy-farm-solar-gorakhpur", state: "Uttar Pradesh", city: "Gorakhpur", generalLocation: "Medical College Road, Gorakhpur, UP", systemCapacityKw: 12, panelWattageWp: 540, panelBrandModel: "Waaree 540W Mono PERC", systemCategory: "Off-Grid Solar System", installationType: "Ground Mounted Array", completionDate: new Date(now.getTime() - 50 * 86400000) },
  ];

  await projCol.insertMany(demoProjects.map(p => ({
    ...p,
    shortDescription: `Turnkey execution of ${p.systemCapacityKw} kW solar project in ${p.city}, ${p.state}. Complete structural engineering and DISCOM net-metering.`,
    fullCaseStudy: `### Project Background\nCustomer required a dependable solar rooftop setup to reduce high grid electricity bills.\n\n### Engineering Execution\nCustom designed using ${p.panelBrandModel} modules and heavy galvanized mounting structures.\n\n### Outcome\nCommissioned with bi-directional net metering. Delivering expected energy yields flawlessly.`,
    hasCustomerPhotoConsent: true,
    hasCustomerVideoConsent: true,
    hasCustomerTestimonialConsent: true,
    customerName: "Verified Client",
    coverImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000&q=85",
    beforePhotos: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"],
    duringPhotos: ["https://images.unsplash.com/photo-1548337138-e87d889cc369?w=800&q=80"],
    afterPhotos: ["https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80"],
    isFeatured: true,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  })));
  console.log(`-> ${demoProjects.length} Portfolio Projects Seeded (3 Bihar, 3 JH, 3 UP)`);

  // 7. FAQs (30 Comprehensive FAQs across all categories)
  console.log("\n[7/12] Seeding 30 FAQs across all categories...");
  const faqCol = db.collection("faqs");
  await faqCol.deleteMany({});

  const demoFaqs = [
    // Subsidies (6)
    { question: "What is the maximum subsidy available under PM Surya Ghar Muft Bijli Yojana?", answer: "Under PM Surya Ghar, eligible residential households receive up to ₹30,000 for 1 kW, ₹60,000 for 2 kW, and a maximum of ₹78,000 for systems 3 kW and above directly credited via DBT into their bank account.", category: "subsidy", sortOrder: 1 },
    { question: "Are commercial buildings eligible for central solar subsidies in India?", answer: "No, direct DBT capital subsidies under PM Surya Ghar are reserved exclusively for residential domestic meters. However, commercial and industrial enterprises receive 40% Accelerated Depreciation tax benefits under Section 32.", category: "subsidy", sortOrder: 2 },
    { question: "How long does it take for the subsidy to be credited into the consumer account?", answer: "Following physical net meter commissioning by your DISCOM and vendor submission of the commissioning report, the national portal processes DBT disbursement typically within 30 to 45 banking days.", category: "subsidy", sortOrder: 3 },
    { question: "Is vendor registration mandatory on the National Solar Portal for subsidy claims?", answer: "Yes, you must install your rooftop system through an officially empaneled and registered solar EPC contractor like VIJOY POWER SOLUTION using ALMM-compliant modules.", category: "subsidy", sortOrder: 4 },
    { question: "Can housing societies (RWAs) claim solar subsidies for common meters?", answer: "Yes, Group Housing Societies (GHS) and Resident Welfare Associations (RWA) can claim subsidy up to ₹18,000 per kW for common area lighting and lift connections, up to 500 kW.", category: "subsidy", sortOrder: 5 },
    { question: "Do I need to pay the full system cost upfront before receiving the subsidy?", answer: "Under standard national guidelines, the consumer funds the project or arranges low-interest collateral-free solar loans from SBI/Canara/PNB, and the subsidy is deposited straight into their bank account.", category: "subsidy", sortOrder: 6 },

    // Net Metering (6)
    { question: "How does net metering work with SBPDCL and NBPDCL in Bihar?", answer: "Your existing unidirectional energy meter is replaced with a bi-directional smart net meter. It registers both power imported from the grid and surplus solar power exported. You pay only for net consumed units.", category: "installation", sortOrder: 7 },
    { question: "What happens if our solar panels generate more electricity than we consume in a month?", answer: "Surplus exported units are rolled over as unit credits to the subsequent monthly electricity bill. In many DISCOMs, any surplus remaining at the end of the financial year is credited at settled tariff rates.", category: "general", sortOrder: 8 },
    { question: "Can I install rooftop solar if my sanctioned electricity load is only 2 kW?", answer: "DISCOM regulations usually permit solar capacity up to 100% of your sanctioned load. If you require a 5 kW solar plant, our team coordinates the load enhancement application with your DISCOM simultaneously.", category: "installation", sortOrder: 9 },
    { question: "Does JBVNL in Jharkhand permit net metering for residential connections?", answer: "Yes, Jharkhand Bijli Vitran Nigam Limited (JBVNL) actively supports bi-directional net metering for domestic and commercial rooftop solar installations.", category: "installation", sortOrder: 10 },
    { question: "Does UPPCL in Uttar Pradesh charge application fees for net metering?", answer: "UPPCL has standard nominal processing and smart bi-directional meter testing fees which are transparently itemized in our turnkey EPC proposals.", category: "installation", sortOrder: 11 },
    { question: "How long does DISCOM net-meter inspection and synchronization take?", answer: "In Bihar, Jharkhand, and UP, the net-metering cycle from online registration to final physical meter swap typically takes 15 to 30 working days.", category: "installation", sortOrder: 12 },

    // Equipment & Wattage (6)
    { question: "Why does VIJOY POWER SOLUTION offer solar panels from 10W to 730W?", answer: "Different applications require different module sizes. Small 10W-100W modules power streetlights, CCTV, and rural huts, while 540W-730W high-efficiency bifacial modules are engineered for residential and industrial rooftops.", category: "residential", sortOrder: 13 },
    { question: "What is the difference between Mono PERC, Bifacial, and N-Type TOPCon panels?", answer: "Mono PERC is the reliable industry workhorse. Bifacial generates up to 20% extra power from rear reflection. N-Type TOPCon features lower temperature degradation (-0.30%/°C), performing significantly better in extreme northern heat.", category: "residential", sortOrder: 14 },
    { question: "What are ALMM and BIS certifications and why are they critical?", answer: "ALMM (Approved List of Models and Manufacturers) is mandated by MNRE. Only ALMM and BIS compliant modules are legally permitted for government grid synchronization and subsidy disbursement.", category: "general", sortOrder: 15 },
    { question: "How much rooftop area is required per 1 kW of solar installation?", answer: "With modern high-efficiency 540W-580W panels, approximately 60 to 70 square feet of shadow-free rooftop space is required per 1 kW of installed capacity.", category: "residential", sortOrder: 16 },
    { question: "Can solar panels withstand heavy storms, hail, and high monsoon winds?", answer: "Yes, our tier-1 panels feature 3.2mm tempered toughened glass tested against 25mm hail stones, mounted on hot-dip galvanized steel engineered for wind speeds exceeding 150 km/h.", category: "installation", sortOrder: 17 },
    { question: "What is the lifespan of solar panels and inverters?", answer: "Solar panels carry a 25 to 30 year linear power performance warranty (guaranteeing >80% output after 25 years). High-quality string inverters typically have a design life of 10 to 15 years.", category: "maintenance", sortOrder: 18 },

    // Residential & Commercial Systems (6)
    { question: "Will an On-Grid solar system provide electricity during a grid power blackout?", answer: "Standard On-Grid inverters have anti-islanding safety protection that disconnects during grid blackouts to protect utility line workers. For backup during power cuts, we recommend Hybrid Solar with battery storage.", category: "residential", sortOrder: 19 },
    { question: "What is the right solar capacity for an average 3-BHK home in Bihar or UP?", answer: "A typical 3-BHK home with 2-3 AC units, refrigerator, washing machine, and lighting generally benefits most from a 3 kW to 5 kW solar plant, offsetting ₹3,500 to ₹6,000 monthly.", category: "residential", sortOrder: 20 },
    { question: "Can commercial facilities use solar power to run heavy machinery and central ACs?", answer: "Yes, our commercial three-phase On-Grid systems synchronize directly with your LT or HT busbar, powering heavy motors, air chillers, and CNC machinery seamlessly.", category: "commercial", sortOrder: 21 },
    { question: "What is an elevated solar pergola structure and when should I choose it?", answer: "An elevated pergola elevates panels 8 to 10 feet above your terrace, preserving 100% of your roof space for walking, family gatherings, or rooftop gardens while keeping your terrace shaded and cooler.", category: "residential", sortOrder: 22 },
    { question: "Can rooftop solar damage my concrete roof or cause monsoon leaks?", answer: "Never. We use chemical anchoring or heavy non-penetrating concrete ballast foundations designed by civil engineers, ensuring zero roof puncture and zero leakage risk.", category: "installation", sortOrder: 23 },
    { question: "How much can a business save annually with a 50 kW commercial solar plant?", answer: "A 50 kW system in Bihar/Jharkhand/UP generates approximately 72,000 units annually. At a commercial tariff of ₹8.50/unit, it delivers around ₹6,12,000 in direct electricity bill savings every year.", category: "commercial", sortOrder: 24 },

    // Maintenance & Non-Ecommerce Policy (6)
    { question: "How often should rooftop solar panels be cleaned in dusty environments?", answer: "In northern and eastern India, we recommend washing panels with plain water once every 10 to 15 days in dry months. Regular cleaning prevents dust soiling and restores 10% to 20% generation.", category: "maintenance", sortOrder: 25 },
    { question: "Do solar panels generate power during cloudy, rainy, or hazy winter days?", answer: "Yes, modern Mono PERC and TOPCon panels absorb diffused daylight and generate 20% to 40% of their rated capacity even under overcast, hazy, or rainy weather.", category: "maintenance", sortOrder: 26 },
    { question: "Why does VIJOY POWER SOLUTION not show fixed prices or an online shopping cart?", answer: "Solar installations are custom civil-electrical engineering projects, not off-the-shelf consumer goods. Cost depends on roof height, distance to electrical panels, structure type, and DISCOM criteria. We provide site-specific transparent quotations.", category: "general", sortOrder: 27 },
    { question: "How can I request a site survey and quotation for my property?", answer: "You can submit an enquiry through our online consultation form, WhatsApp us at +91 94310 00000, or call our regional office. Our solar engineer will inspect your site and provide a customized proposal.", category: "general", sortOrder: 28 },
    { question: "What warranties does VIJOY POWER SOLUTION provide?", answer: "We provide 12-year manufacturer product warranty, 25-30 year linear generation performance warranty on panels, 5-10 year warranty on inverters, and 5 years comprehensive workmanship & structural warranty.", category: "maintenance", sortOrder: 29 },
    { question: "Are financing and EMI options available for residential rooftop solar?", answer: "Yes, nationalized banks including State Bank of India, Punjab National Bank, and Canara Bank provide collateral-free rooftop solar loans at attractive interest rates under PM Surya Ghar.", category: "subsidy", sortOrder: 30 },
  ];

  await faqCol.insertMany(demoFaqs.map(f => ({ ...f, isPublished: true, createdAt: now, updatedAt: now })));
  console.log(`-> ${demoFaqs.length} Comprehensive FAQs Seeded`);

  // 8. Educational Blog Articles (10 Articles)
  console.log("\n[8/12] Seeding 10 Educational Knowledge Hub Blog Articles...");
  const blogCol = db.collection("blogs");
  await blogCol.deleteMany({});

  const demoBlogs = [
    { title: "PM Surya Ghar Muft Bijli Yojana: Complete Subsidy Guide for Bihar (2026)", slug: "pm-surya-ghar-subsidy-guide-bihar", category: "Subsidy Guides", excerpt: "Step-by-step guide to applying for up to ₹78,000 national rooftop subsidy through SBPDCL and NBPDCL DISCOM portals in Bihar." },
    { title: "On-Grid vs Off-Grid vs Hybrid Solar: Which One is Right for You in Jharkhand?", slug: "on-grid-vs-off-grid-vs-hybrid-solar-jharkhand", category: "Solar Technology", excerpt: "A practical comparison of solar system architectures for Ranchi, Jamshedpur, and Dhanbad homeowners and businesses." },
    { title: "Why 550W+ TOPCon Bifacial Panels are Dominating Modern Rooftop Installations", slug: "why-topcon-bifacial-modules-dominate", category: "Solar Technology", excerpt: "How N-type TOPCon technology achieves up to 22.5% efficiency and better generation under high ambient temperatures in Eastern India." },
    { title: "Solar Net Metering in Uttar Pradesh: UPPCL Guidelines and Approval Timelines", slug: "solar-net-metering-in-uttar-pradesh-uppcl", category: "Regulatory Guides", excerpt: "Everything you need to know about bi-directional net-metering approvals and consumer rights under UPPCL jurisdiction." },
    { title: "How Much Can You Save with a 3 kW Solar System in Patna and Gaya?", slug: "how-much-save-with-3kw-solar-patna-gaya", category: "Cost & Savings", excerpt: "Real financial analysis showing monthly unit generation, DISCOM tariff offsets, and ROI timeline for Bihar homeowners." },
    { title: "Elevated Solar Pergola: How to Keep 100% of Your Rooftop Space Usable", slug: "elevated-solar-pergola-usable-rooftop-space", category: "Installation & Design", excerpt: "Why elevated hot-dip galvanized mounting structures are the ideal choice for terrace gardens, walking, and urban homes." },
    { title: "Solar Panels for Cold Storage and Rice Mills: Beating Daytime Peak Tariffs", slug: "solar-panels-for-cold-storage-and-rice-mills", category: "Commercial & Industrial", excerpt: "How commercial food processing and refrigeration plants in Muzaffarpur and Varanasi achieve payback within 3.5 years." },
    { title: "How Weather and Soiling Affect Solar Generation in Bihar and UP (and How to Fix It)", slug: "weather-soiling-solar-generation-bihar-up", category: "Maintenance", excerpt: "Essential cleaning and maintenance practices to overcome dust deposition, seasonal fog, and monsoon cloud cover." },
    { title: "Agricultural Solar Water Pumps: PM-KUSUM Scheme Insights for Farmers", slug: "agricultural-solar-water-pumps-pm-kusum", category: "Agricultural Solar", excerpt: "How solar VFD water pumps eliminate diesel expenses and transform irrigation for rural farmland across Eastern India." },
    { title: "Understanding ALMM (Approved List of Models and Manufacturers) for Solar Panels", slug: "understanding-almm-solar-panels-compliance", category: "Regulatory Guides", excerpt: "Why only ALMM-listed solar panels qualify for government subsidies and utility net metering in India." },
  ];

  await blogCol.insertMany(demoBlogs.map((b, idx) => ({
    ...b,
    authorName: "Er. Vijoy Kumar",
    coverImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000&q=80",
    content: `## ${b.title}\n\nSolar energy adoption is transforming households and businesses across Bihar, Jharkhand, and Uttar Pradesh. With abundant solar irradiance throughout the year, switching to solar represents both an environmental milestone and an outstanding financial investment.\n\n### Key Highlights\n- High efficiency tier-1 modules (10W to 730W)\n- Up to ₹78,000 direct DBT subsidy under PM Surya Ghar\n- Net metering synchronization with local DISCOMs\n- 25-year manufacturer performance warranties\n\n### Practical Engineering Recommendations\nWhen planning a solar installation, always ensure thorough structural site inspection, certified mounting brackets, and proper chemical earthing. Contact VIJOY POWER SOLUTION for site-specific engineering consultation.`,
    tags: ["solar", "renewable-energy", "pm-surya-ghar", "bihar", "jharkhand", "up"],
    isPublished: true,
    publishedAt: new Date(now.getTime() - (idx + 1) * 3 * 86400000),
    createdAt: now,
    updatedAt: now,
  })));
  console.log(`-> ${demoBlogs.length} Educational Hub Articles Seeded`);

  // 9. Service Areas / Locations (15 Locations: 5 Bihar, 5 JH, 5 UP)
  console.log("\n[9/12] Seeding 15 Service Areas across Bihar, Jharkhand, and UP...");
  const locCol = db.collection("locations");
  await locCol.deleteMany({});

  const demoLocations = [
    // Bihar (5)
    { state: "Bihar", stateSlug: "bihar", district: "Patna", city: "Patna", citySlug: "patna", postalCodes: ["800001", "800020", "800026"], priorityArea: true },
    { state: "Bihar", stateSlug: "bihar", district: "Gaya", city: "Gaya", citySlug: "gaya", postalCodes: ["823001", "823002"], priorityArea: true },
    { state: "Bihar", stateSlug: "bihar", district: "Muzaffarpur", city: "Muzaffarpur", citySlug: "muzaffarpur", postalCodes: ["842001", "842002"], priorityArea: false },
    { state: "Bihar", stateSlug: "bihar", district: "Bhagalpur", city: "Bhagalpur", citySlug: "bhagalpur", postalCodes: ["812001"], priorityArea: false },
    { state: "Bihar", stateSlug: "bihar", district: "Darbhanga", city: "Darbhanga", citySlug: "darbhanga", postalCodes: ["846001"], priorityArea: false },

    // Jharkhand (5)
    { state: "Jharkhand", stateSlug: "jharkhand", district: "Ranchi", city: "Ranchi", citySlug: "ranchi", postalCodes: ["834001", "834002"], priorityArea: true },
    { state: "Jharkhand", stateSlug: "jharkhand", district: "East Singhbhum", city: "Jamshedpur", citySlug: "jamshedpur", postalCodes: ["831001", "831002"], priorityArea: true },
    { state: "Jharkhand", stateSlug: "jharkhand", district: "Dhanbad", city: "Dhanbad", citySlug: "dhanbad", postalCodes: ["826001"], priorityArea: false },
    { state: "Jharkhand", stateSlug: "jharkhand", district: "Bokaro", city: "Bokaro", citySlug: "bokaro", postalCodes: ["827001"], priorityArea: false },
    { state: "Jharkhand", stateSlug: "jharkhand", district: "Hazaribagh", city: "Hazaribagh", citySlug: "hazaribagh", postalCodes: ["825301"], priorityArea: false },

    // Uttar Pradesh (5)
    { state: "Uttar Pradesh", stateSlug: "uttar-pradesh", district: "Lucknow", city: "Lucknow", citySlug: "lucknow", postalCodes: ["226001", "226010"], priorityArea: true },
    { state: "Uttar Pradesh", stateSlug: "uttar-pradesh", district: "Varanasi", city: "Varanasi", citySlug: "varanasi", postalCodes: ["221001", "221002"], priorityArea: true },
    { state: "Uttar Pradesh", stateSlug: "uttar-pradesh", district: "Kanpur Nagar", city: "Kanpur", citySlug: "kanpur", postalCodes: ["208001"], priorityArea: false },
    { state: "Uttar Pradesh", stateSlug: "uttar-pradesh", district: "Prayagraj", city: "Prayagraj", citySlug: "prayagraj", postalCodes: ["211001"], priorityArea: false },
    { state: "Uttar Pradesh", stateSlug: "uttar-pradesh", district: "Gorakhpur", city: "Gorakhpur", citySlug: "gorakhpur", postalCodes: ["273001"], priorityArea: false },
  ];

  await locCol.insertMany(demoLocations.map(l => ({
    ...l,
    serviceAvailability: "available",
    contactPhone: "+91 94310 00000",
    overviewText: `Certified solar rooftop installations, DISCOM net-metering approvals, and PM Surya Ghar subsidy processing across ${l.city} and surrounding areas.`,
    localSolarFaqs: [
      { question: `How long does solar net metering take in ${l.city}?`, answer: `In ${l.city}, net meter approval and synchronization is typically completed within 15 to 25 working days.` },
      { question: `Are residential subsidies active in ${l.city}?`, answer: `Yes, domestic electricity consumers in ${l.city} are eligible for up to ₹78,000 direct central subsidy.` }
    ],
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  })));
  console.log(`-> ${demoLocations.length} Regional Service Areas Seeded`);

  // 10. Dynamic Pages CMS (7 Standard Pages)
  console.log("\n[10/12] Seeding Dynamic Pages in Page Builder CMS...");
  const pageCol = db.collection("pages");
  await pageCol.deleteMany({});

  const demoPages = [
    {
      title: "VIJOY POWER SOLUTION — Premier Solar EPC",
      slug: "home",
      heroHeading: "Power Your Future with Solar Energy",
      heroSubtitle: "Reliable Solar Panel Solutions & Professional Installation Across Bihar, Jharkhand, and Uttar Pradesh. Complete engineering, DISCOM net metering liaison, and PM Surya Ghar subsidy guidance.",
      isPublished: true,
      sections: [
        {
          sectionId: "home-hero",
          sectionType: "hero",
          title: "Power Your Future with Solar Energy",
          badgeText: "Certified Solar EPC • Bihar | Jharkhand | Uttar Pradesh",
          isVisible: true,
          sortOrder: 1,
        }
      ]
    },
    {
      title: "About VIJOY POWER SOLUTION",
      slug: "about",
      heroHeading: "About VIJOY POWER SOLUTION",
      heroSubtitle: "Delivering clean, dependable solar rooftop engineering, ALMM-compliant panel supply, and seamless DISCOM net-metering across Eastern and Northern India.",
      contentHtml: "<p>VIJOY POWER SOLUTION was founded with a singular conviction: renewable energy must be engineered for real Indian operating conditions. Solar panels in Bihar and Uttar Pradesh face intense summer heat exceeding 45°C, high dust deposition, and severe monsoon winds.</p><p>We bridge the gap between premium tier-1 equipment and flawless civil-electrical execution. From 10W specialized modules up to 730W high-efficiency Heterojunction and N-Type TOPCon bifacial arrays, every system is designed around the customer's exact roof geometry and energy consumption pattern.</p>",
      isPublished: true,
      sections: [
        {
          sectionId: "about-mission",
          sectionType: "features",
          title: "Our Engineering Heritage & Values",
          badgeText: "Quality Principles",
          isVisible: true,
          sortOrder: 1,
          items: [
            { title: "ALMM & BIS Verified", description: "Formally verified equipment approved by MNRE for seamless DISCOM approvals." },
            { title: "Precision Structural Safety", description: "80-micron hot-dip galvanized mounting frames tested for 150 km/h wind resistance." },
            { title: "Triple Chemical Earthing", description: "Independent earthing pits for AC, DC, and lightning arresters for maximum appliance safety." }
          ]
        }
      ]
    },
    {
      title: "Contact VIJOY POWER SOLUTION",
      slug: "contact",
      heroHeading: "Contact VIJOY POWER SOLUTION",
      heroSubtitle: "Reach out to our certified solar engineering and technical support teams. We are available Monday through Saturday across Bihar, Jharkhand, and Uttar Pradesh.",
      isPublished: true,
      sections: []
    },
    {
      title: "PM Surya Ghar: Muft Bijli Yojana",
      slug: "subsidy-information",
      heroHeading: "PM Surya Ghar: Muft Bijli Yojana",
      heroSubtitle: "Educational guide to national financial assistance, eligibility guidelines, DISCOM technical requirements, and step-by-step application workflow for rooftop solar in Bihar, Jharkhand, and Uttar Pradesh.",
      isPublished: true,
      sections: []
    },
    {
      title: "Privacy Policy",
      slug: "privacy-policy",
      heroSubtitle: "Official privacy practices regarding customer consultation data, site surveys, and consent.",
      contentHtml: "<p>VIJOY POWER SOLUTION collects customer information strictly for evaluating solar rooftop suitability, arranging engineering site surveys, providing private commercial quotations, and assisting with DISCOM net-metering applications.</p><p>Customer photos and project testimonials are published strictly after receiving documented written or digital consent. Private residential addresses and phone numbers are never published.</p>",
      isPublished: true,
      sections: []
    },
    {
      title: "Terms and Conditions",
      slug: "terms-and-conditions",
      heroSubtitle: "Terms governing solar consultation, engineering quotations, and installation contracts.",
      contentHtml: "<p>All commercial figures provided through internal quotations or consultation discussions are site-specific and subject to physical rooftop inspection, distance to distribution boards, and local utility infrastructure.</p><p>VIJOY POWER SOLUTION is an engineering EPC contractor. We do not provide public online ecommerce sales, shopping carts, or online payment gateways for solar modules or installation packages.</p>",
      isPublished: true,
      sections: []
    },
    {
      title: "Regulatory & Engineering Disclaimer",
      slug: "disclaimer",
      heroSubtitle: "Official disclaimers on solar generation estimates, government subsidies, and pricing.",
      contentHtml: "<p>Any solar generation figures or savings approximations shown on this website or calculated by our interactive calculator are estimated based on regional average solar irradiance. Actual energy output varies depending on local weather, rooftop tilt angle, seasonal shadow obstructions, and periodic panel cleaning.</p><p>Subsidy eligibility, benefits, documentation, and approval depend on applicable government rules and DISCOM requirements under PM Surya Ghar. Subsidy sanction remains under the exclusive purview of MNRE and the respective state DISCOMs.</p>",
      isPublished: true,
      sections: []
    }
  ];

  await pageCol.insertMany(demoPages.map(p => ({ ...p, createdAt: now, updatedAt: now })));
  console.log(`-> ${demoPages.length} Standard Dynamic Pages Seeded in Page Builder CMS`);

  // 11. Customer Testimonials (6 Verified 5-Star Reviews)
  console.log("\n[11/12] Seeding Verified Customer Testimonials with Consent...");
  const testCol = db.collection("testimonials");
  await testCol.deleteMany({});

  const demoTestimonials = [
    { customerName: "Dr. B. K. Sahay", customerCity: "Patna", customerState: "Bihar", systemCapacityKw: 5, rating: 5, reviewText: "Our monthly electricity bill dropped from ₹7,500 to under ₹400 after installing a 5kW On-Grid plant with VIJOY POWER SOLUTION. Er. Vijoy Kumar and his team handled the entire SBPDCL net-metering approval without any hassle.", hasConsentToPublish: true, isApproved: true, sortOrder: 1 },
    { customerName: "Rajeev Agarwal", customerCity: "Ranchi", customerState: "Jharkhand", systemCapacityKw: 10, rating: 5, reviewText: "Installed a 10kW hybrid solar plant for our diagnostic center in Ranchi. The automatic battery changeover is instant, and we haven't faced a single minute of power interruption since commissioning.", hasConsentToPublish: true, isApproved: true, sortOrder: 2 },
    { customerName: "Sanjay Singhania", customerCity: "Varanasi", customerState: "Uttar Pradesh", systemCapacityKw: 25, rating: 5, reviewText: "Superb engineering quality and neat cable management on our textile showroom roof. Delivered before deadline and UPPCL net-metering was activated within 3 weeks.", hasConsentToPublish: true, isApproved: true, sortOrder: 3 },
    { customerName: "Arun Prasad", customerCity: "Gaya", customerState: "Bihar", systemCapacityKw: 3.3, rating: 5, reviewText: "Received the full ₹78,000 PM Surya Ghar national subsidy credited directly into my SBI account within 40 days of installation. Highly professional solar team in Bihar.", hasConsentToPublish: true, isApproved: true, sortOrder: 4 },
    { customerName: "Manoj Verma", customerCity: "Jamshedpur", customerState: "Jharkhand", systemCapacityKw: 8, rating: 5, reviewText: "Extremely durable elevated galvanized structure. We had no issues during the storm season, and generation is consistently meeting engineering projections.", hasConsentToPublish: true, isApproved: true, sortOrder: 5 },
    { customerName: "Alok Srivastava", customerCity: "Lucknow", customerState: "Uttar Pradesh", systemCapacityKw: 15, rating: 5, reviewText: "Professional approach from site survey to meter testing. Clear transparent quotation without hidden costs. Highly recommend VIJOY POWER SOLUTION for commercial rooftops.", hasConsentToPublish: true, isApproved: true, sortOrder: 6 },
  ];

  await testCol.insertMany(demoTestimonials.map(t => ({ ...t, createdAt: now, updatedAt: now })));
  console.log(`-> ${demoTestimonials.length} Verified Customer Testimonials Seeded`);

  // 12. CRM Leads & Pipeline (30 Realistic Multi-Stage Leads)
  console.log("\n[12/12] Seeding 30 Multi-Stage Leads, Surveys, Quotes, and Installations...");
  const leadsCol = db.collection("leads");
  await leadsCol.deleteMany({});

  const stageList = [
    "new", "new", "new", "contacted", "contacted", "qualified", "qualified",
    "survey_scheduled", "survey_scheduled", "survey_completed", "survey_completed",
    "quotation_sent", "quotation_sent", "negotiation", "negotiation",
    "won", "won", "installation_in_progress", "installation_in_progress", "completed", "completed"
  ];

  const leadSeedConfigs = [
    { name: "Anand Prakash", phone: "9835012345", email: "anand.prakash@gmail.com", state: "Bihar", city: "Patna", bill: 4500, units: 550, stage: "new", priority: "high", watt: 550 },
    { name: "M/s Maa Sharda Cold Storage", phone: "9431198765", email: "contact@sharda-coldstorage.com", state: "Bihar", city: "Muzaffarpur", bill: 65000, units: 7200, stage: "contacted", priority: "high", watt: 550 },
    { name: "Vikash Chandra", phone: "9771023456", email: "vikash.c@yahoo.com", state: "Jharkhand", city: "Ranchi", bill: 3200, units: 380, stage: "qualified", priority: "medium", watt: 540 },
    { name: "Dr. Arvind K. Mishra", phone: "9430034567", email: "dr.mishra.clinic@gmail.com", state: "Uttar Pradesh", city: "Varanasi", bill: 14000, units: 1600, stage: "survey_scheduled", priority: "high", watt: 550 },
    { name: "Rameshwar Singh", phone: "9431445678", email: "singh.rameshwar@rediffmail.com", state: "Bihar", city: "Gaya", bill: 2800, units: 340, stage: "survey_completed", priority: "medium", watt: 550 },
    { name: "Tata Steel Ancillary Unit", phone: "9431356789", email: "procurement@ancillary-ts.co.in", state: "Jharkhand", city: "Jamshedpur", bill: 125000, units: 14000, stage: "quotation_sent", priority: "high", watt: 580 },
    { name: "Sunita Devi", phone: "9934067890", email: "sunita.devi.patna@gmail.com", state: "Bihar", city: "Patna", bill: 3600, units: 420, stage: "negotiation", priority: "high", watt: 550 },
    { name: "Er. Deepak Kumar", phone: "9431878901", email: "deepak.engg.patna@gmail.com", state: "Bihar", city: "Patna", bill: 8200, units: 980, stage: "won", priority: "high", watt: 550 },
    { name: "Shree Krishna Sweet & Bakery", phone: "9835889012", email: "krishna.sweets.gkp@gmail.com", state: "Uttar Pradesh", city: "Gorakhpur", bill: 22000, units: 2500, stage: "installation_in_progress", priority: "high", watt: 550 },
    { name: "Manoj Tiwary", phone: "9430190123", email: "manoj.tiwary.dhn@gmail.com", state: "Jharkhand", city: "Dhanbad", bill: 4100, units: 480, stage: "completed", priority: "medium", watt: 550 },
    { name: "Avinash Kumar", phone: "9431201111", email: "avinash.k@gmail.com", state: "Bihar", city: "Bhagalpur", bill: 5200, units: 620, stage: "new", priority: "medium", watt: 540 },
    { name: "Prabhat Singh", phone: "9431202222", email: "prabhat.singh@gmail.com", state: "Bihar", city: "Darbhanga", bill: 3800, units: 450, stage: "contacted", priority: "medium", watt: 550 },
    { name: "Rohit Agrawal", phone: "9431203333", email: "rohit.agrawal@gmail.com", state: "Jharkhand", city: "Bokaro", bill: 6100, units: 710, stage: "qualified", priority: "high", watt: 550 },
    { name: "Kishore Soren", phone: "9431204444", email: "kishore.soren@gmail.com", state: "Jharkhand", city: "Hazaribagh", bill: 2900, units: 330, stage: "survey_scheduled", priority: "low", watt: 500 },
    { name: "Dr. Manish Tandon", phone: "9431205555", email: "manish.tandon@gmail.com", state: "Uttar Pradesh", city: "Lucknow", bill: 18500, units: 2100, stage: "quotation_sent", priority: "high", watt: 580 },
    { name: "Gaurav Tripathi", phone: "9431206666", email: "gaurav.tripathi@gmail.com", state: "Uttar Pradesh", city: "Kanpur", bill: 9400, units: 1100, stage: "negotiation", priority: "high", watt: 550 },
    { name: "Santosh Yadav", phone: "9431207777", email: "santosh.yadav@gmail.com", state: "Uttar Pradesh", city: "Prayagraj", bill: 4200, units: 500, stage: "won", priority: "medium", watt: 540 },
    { name: "Brijesh Maurya", phone: "9431208888", email: "brijesh.maurya@gmail.com", state: "Uttar Pradesh", city: "Gorakhpur", bill: 3100, units: 370, stage: "completed", priority: "medium", watt: 550 },
    { name: "Dinesh Chaudhary", phone: "9431209999", email: "dinesh.chaudhary@gmail.com", state: "Bihar", city: "Patna", bill: 4800, units: 580, stage: "new", priority: "high", watt: 550 },
    { name: "Suresh Prasad", phone: "9431210000", email: "suresh.prasad@gmail.com", state: "Bihar", city: "Gaya", bill: 2600, units: 310, stage: "contacted", priority: "low", watt: 500 },
    { name: "Mukesh Sah", phone: "9431211111", email: "mukesh.sah@gmail.com", state: "Bihar", city: "Muzaffarpur", bill: 7500, units: 900, stage: "qualified", priority: "high", watt: 550 },
    { name: "Vivek Keshri", phone: "9431212222", email: "vivek.keshri@gmail.com", state: "Jharkhand", city: "Ranchi", bill: 4900, units: 580, stage: "survey_completed", priority: "medium", watt: 540 },
    { name: "Nitin Murmu", phone: "9431213333", email: "nitin.murmu@gmail.com", state: "Jharkhand", city: "Jamshedpur", bill: 11000, units: 1300, stage: "quotation_sent", priority: "high", watt: 580 },
    { name: "Rajendra Rawani", phone: "9431214444", email: "rajendra.rawani@gmail.com", state: "Jharkhand", city: "Dhanbad", bill: 3900, units: 460, stage: "negotiation", priority: "medium", watt: 550 },
    { name: "Pooja Pandey", phone: "9431215555", email: "pooja.pandey@gmail.com", state: "Uttar Pradesh", city: "Varanasi", bill: 3400, units: 410, stage: "new", priority: "medium", watt: 550 },
    { name: "Shailendra Dixit", phone: "9431216666", email: "shailendra.dixit@gmail.com", state: "Uttar Pradesh", city: "Lucknow", bill: 12500, units: 1450, stage: "installation_in_progress", priority: "high", watt: 580 },
    { name: "Arvind Shukla", phone: "9431217777", email: "arvind.shukla@gmail.com", state: "Uttar Pradesh", city: "Kanpur", bill: 5600, units: 670, stage: "completed", priority: "medium", watt: 550 },
    { name: "Kunal Kashyap", phone: "9431218888", email: "kunal.kashyap@gmail.com", state: "Bihar", city: "Patna", bill: 4300, units: 510, stage: "qualified", priority: "medium", watt: 540 },
    { name: "Anupam Sinha", phone: "9431219999", email: "anupam.sinha@gmail.com", state: "Jharkhand", city: "Ranchi", bill: 6800, units: 800, stage: "won", priority: "high", watt: 550 },
    { name: "Mohit Srivastava", phone: "9431220000", email: "mohit.srivastava@gmail.com", state: "Uttar Pradesh", city: "Prayagraj", bill: 3700, units: 440, stage: "survey_scheduled", priority: "medium", watt: 550 },
  ];

  const demoLeads = leadSeedConfigs.map((cfg, idx) => ({
    leadId: `VPS-LD-${1001 + idx}`,
    fullName: cfg.name,
    phone: cfg.phone,
    email: cfg.email,
    state: cfg.state,
    city: cfg.city,
    customerType: cfg.bill >= 20000 ? "commercial" : "residential",
    solarSolutionType: cfg.bill >= 20000 ? "Commercial & Industrial (C&I)" : "Residential Rooftop",
    approximateMonthlyBillInr: cfg.bill,
    monthlyElectricityConsumptionUnits: cfg.units,
    roofType: cfg.bill >= 50000 ? "Tin / Metal Shed" : "RCC (Concrete Terrace)",
    roofAreaSqFt: Math.round(cfg.units * 0.7),
    wattagePreference: cfg.watt,
    stage: cfg.stage,
    priority: cfg.priority,
    leadSource: idx % 3 === 0 ? "website_quote_form" : idx % 3 === 1 ? "calculator" : "whatsapp",
    assignedTo: salesRahul?._id,
    notes: `Enquiry generated for ${cfg.city}, ${cfg.state}. Evaluated for solar feasibility.`,
    isArchived: false,
    createdAt: new Date(now.getTime() - (30 - idx) * 8 * 3600000),
    updatedAt: new Date(now.getTime() - (idx % 5) * 4 * 3600000),
  }));

  await leadsCol.insertMany(demoLeads);
  console.log(`-> ${demoLeads.length} Multi-Stage CRM Leads Seeded`);

  // Grab selected leads for relations
  const lead4 = await leadsCol.findOne({ leadId: "VPS-LD-1004" });
  const lead5 = await leadsCol.findOne({ leadId: "VPS-LD-1005" });
  const lead8 = await leadsCol.findOne({ leadId: "VPS-LD-1008" });
  const lead9 = await leadsCol.findOne({ leadId: "VPS-LD-1009" });

  // Follow-ups
  const followCol = db.collection("followups");
  await followCol.deleteMany({});
  const demoFollowUps = [
    { leadId: lead4?._id, assignedTo: techSunil?._id, followUpType: "site_survey", status: "pending", scheduledAt: new Date(now.getTime() + 18 * 3600000), notes: "Conduct physical drone shadow survey at clinic." },
    { leadId: lead5?._id, assignedTo: salesRahul?._id, followUpType: "phone_call", status: "due_today", scheduledAt: new Date(now.getTime() + 2 * 3600000), notes: "Review 3.3kW quote terms with Mr. Rameshwar Singh." },
    { leadId: lead8?._id, assignedTo: installAmit?._id, followUpType: "meeting", status: "due_today", scheduledAt: new Date(now.getTime() + 5 * 3600000), notes: "Confirm material dispatch with Er. Deepak Kumar." },
    { leadId: lead9?._id, assignedTo: techSunil?._id, followUpType: "site_survey", status: "overdue", scheduledAt: new Date(now.getTime() - 24 * 3600000), notes: "Final testing check of ACDB earthing." },
  ];
  await followCol.insertMany(demoFollowUps.map(f => ({ ...f, createdAt: now, updatedAt: now })));

  // Site Surveys
  const surveyCol = db.collection("sitesurveys");
  await surveyCol.deleteMany({});
  const demoSurveys = [
    {
      surveyId: "VPS-SRV-1001",
      leadId: lead4?._id,
      customerName: "Dr. Arvind K. Mishra",
      customerPhone: "9430034567",
      siteAddress: "Mishra Clinic, Orderly Bazar, Varanasi, UP",
      state: "Uttar Pradesh",
      city: "Varanasi",
      surveyDate: new Date(now.getTime() + 18 * 3600000),
      assignedTechnician: techSunil?._id,
      status: "scheduled",
      feasibilityStatus: "pending_review",
      roofType: "RCC (Concrete Terrace)",
      shadingObservations: "Minimal shading along Northern parapet",
      existingSanctionedLoadKw: 15,
      suggestedSystemCapacityKw: 10,
      sitePhotographs: ["https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&q=80"],
      createdAt: now,
      updatedAt: now,
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
      surveyNotes: "3.3kW plant ideal for PM Surya Ghar subsidy.",
      sitePhotographs: ["https://images.unsplash.com/photo-1548337138-e87d889cc369?w=600&q=80"],
      createdAt: now,
      updatedAt: now,
    },
  ];
  await surveyCol.insertMany(demoSurveys);

  // Quotations
  const quoteCol = db.collection("quotations");
  await quoteCol.deleteMany({});
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
        { description: "1x 3.3kW Growatt On-Grid Inverter with Wi-Fi", quantity: 1, unit: "Set", unitPrice: 28000, totalPrice: 28000 },
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
      createdAt: now,
      updatedAt: now,
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
      createdAt: now,
      updatedAt: now,
    },
  ];
  await quoteCol.insertMany(demoQuotations);

  // Installation Jobs
  const installCol = db.collection("installationjobs");
  await installCol.deleteMany({});
  const demoJobs = [
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
      createdAt: now,
      updatedAt: now,
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
      installationNotes: "Inverter wiring complete. Awaiting UPPCL inspector visit.",
      createdAt: now,
      updatedAt: now,
    },
  ];
  await installCol.insertMany(demoJobs);

  // Settings
  const setCol = db.collection("settings");
  await setCol.deleteMany({});
  await setCol.insertMany([
    {
      key: "general",
      value: {
        companyName: "VIJOY POWER SOLUTION",
        tagline: "Empowering Bihar, Jharkhand & UP with Reliable Solar Energy",
        phone: "+91 94310 00000",
        whatsapp: "919431000000",
        email: "contact@vijoypowersolution.com",
        address: "Main Road, Near Power Grid Substation, Gaya, Bihar - 823001",
        workingHours: "Monday – Saturday: 9:00 AM – 7:00 PM IST (Sunday closed)",
        primaryStates: ["Bihar", "Jharkhand", "Uttar Pradesh"],
      },
      createdAt: now,
      updatedAt: now,
    },
    {
      key: "calculator",
      value: {
        dailySunHoursAverage: 4.8,
        unitsGeneratedPerKwMonthly: 125,
        defaultTariffPerUnitInr: 7.5,
        sqFtPerKw: 70,
        co2SavedKgPerKwh: 0.82,
      },
      createdAt: now,
      updatedAt: now,
    },
    {
      key: "homepage",
      value: {
        hero: {
          badge: "Certified Solar EPC • Bihar | Jharkhand | Uttar Pradesh",
          headline: "Power Your Future with Solar Energy",
          subheading:
            "Reliable Solar Panel Solutions & Professional Installation Across Bihar, Jharkhand, and Uttar Pradesh. Complete engineering, DISCOM net metering liaison, and PM Surya Ghar subsidy guidance.",
          checkpoints: [
            "Modules from 10W to 730W",
            "Up to ₹78,000 Govt Subsidy Guidance",
            "Heavy-Duty Hot-Dip Galvanized Mounts",
            "25-Year Linear Power Warranty",
          ],
          ctaPrimaryText: "Get Free Solar Consultation",
          ctaPrimaryLink: "/get-quote",
          ctaSecondaryText: "Explore Real Installations",
          ctaSecondaryLink: "/projects",
          transparencyNote:
            "Strict Transparency: No hidden costs. Zero public pricing fabrication. Private quotations only.",
        },
        stats: [
          { label: "Rooftop Installations", value: "350+", suffix: "Confirmed Sites" },
          { label: "Clean Capacity Installed", value: "2.8+", suffix: "Megawatts" },
          { label: "Primary Service Regions", value: "3", suffix: "Bihar, JH, UP" },
          { label: "Engineering Experience", value: "8+", suffix: "Years Active" },
        ],
        whyUs: {
          badge: "Our Commitments",
          title: "Why Choose VIJOY POWER SOLUTION",
          subtitle:
            "Solar is a 25-year investment. We combine robust civil-electrical engineering with dedicated local service across Bihar, Jharkhand, and Uttar Pradesh.",
          pillars: [
            {
              title: "Site-Specific Engineering",
              desc: "No cookie-cutter solar kits. We perform precision shadow modeling and roof load calculations before finalizing any array layout.",
            },
            {
              title: "Tier-1 ALMM Certified Panels",
              desc: "Exclusively tier-1 panels with 25 to 30 year performance warranties, fully compliant with national PM Surya Ghar subsidy guidelines.",
            },
            {
              title: "Heavy-Duty Mounting Structures",
              desc: "Engineered hot-dip galvanized steel structures capable of withstanding severe eastern Indian monsoon storm winds up to 150 km/h.",
            },
            {
              title: "Hassle-Free Net Metering Liaison",
              desc: "Complete end-to-end liaison with SBPDCL, NBPDCL, JBVNL, and UPPCL for prompt bi-directional meter testing and grid connection.",
            },
            {
              title: "Regional Support in Bihar, JH & UP",
              desc: "Dedicated field technicians based locally in Patna, Gaya, Ranchi, and Lucknow for swift on-site maintenance and troubleshooting.",
            },
            {
              title: "Strict Commercial Transparency",
              desc: "Transparent private commercial line items with zero hidden charges, realistic ROI models, and clear documentation.",
            },
          ],
        },
        process: {
          badge: "Clear Customer Journey",
          title: "How Your Solar Journey Works",
          subtitle:
            "From initial rooftop shadow assessment to final DISCOM net-meter synchronization in 8 transparent steps.",
          steps: [
            { step: "01", title: "Submit Enquiry", desc: "Share your location, electricity bill, and primary objectives via our online form or WhatsApp." },
            { step: "02", title: "Initial Consultation", desc: "Our solar consultant reviews your sanctioned power load and discusses system options." },
            { step: "03", title: "Site Survey", desc: "A field engineer inspects your roof orientation, shadow obstructions, and cable routes." },
            { step: "04", title: "Engineering Design", desc: "Custom 3D layout, module count, and inverter capacity engineered for your property." },
            { step: "05", title: "Private Quotation & Approval", desc: "Comprehensive transparent quotation with line items and subsidy projections for your review." },
            { step: "06", title: "Installation Scheduling", desc: "Delivery of ALMM certified modules, inverters, and galvanized steel mounting structures." },
            { step: "07", title: "Installation & Testing", desc: "Rigorous physical mounting, DC/AC wiring, multi-point chemical earthing, and lightning protection." },
            { step: "08", title: "Handover & Net Metering", desc: "DISCOM synchronization, bi-directional meter testing, cloud monitoring app setup, and handover." },
          ],
        },
        videos: {
          badge: "Video Stories & Walkthroughs",
          title: "See Our Installations in Action",
          subtitle:
            "Watch real site surveys, rooftop mounting structure erections, inverter synchronization, and client reviews.",
          items: [
            {
              title: "10 kW Elevated Rooftop Solar Walkthrough in Patna",
              location: "Kankarbagh, Patna",
              duration: "1:05",
              thumbnail: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            },
            {
              title: "25 kW Bodh Gaya Hotel Solar Commissioning & SBPDCL Inspection",
              location: "Bodh Gaya, Bihar",
              duration: "1:42",
              thumbnail: "https://images.unsplash.com/photo-1548337138-e87d889cc369?w=800&q=80",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            },
          ],
        },
        ctaBanner: {
          badge: "Free Engineering Consultation Across Bihar, JH & UP",
          title: "Ready to Switch to Solar?",
          description:
            "Take the first step towards clean, reliable power and drastically lower monthly electricity bills. Book an appointment with our solar engineering specialist today.",
          buttonText: "Request Free Consultation",
          buttonLink: "/get-quote",
        },
      },
      createdAt: now,
      updatedAt: now,
    },
  ]);

  console.log("\n===============================================================");
  console.log("SUCCESS! ALL 12 DEMO MODULES FULLY SEEDED INTO MONGODB ATLAS:");
  console.log(" - 6 Team Accounts with Roles (admin@vijoypowersolution.com)");
  console.log(" - 12 Product Categories");
  console.log(" - 21 Solar Products (10W to 730W Full Span)");
  console.log(" - 15 Solar EPC Services");
  console.log(" - 12 Solar Solutions");
  console.log(" - 9 Customer-Consent Verified Projects (Bihar, JH, UP)");
  console.log(" - 30 Comprehensive FAQs");
  console.log(" - 10 Educational Blog Articles");
  console.log(" - 15 Service Areas / Locations");
  console.log(" - 7 Dynamic CMS Pages in Page Builder");
  console.log(" - 6 Verified Customer Testimonials");
  console.log(" - 30 CRM Pipeline Leads, Surveys, Quotes & Installation Jobs");
  console.log("===============================================================");

  await mongoose.disconnect();
}

seedDemoData().catch((err) => {
  console.error("Demo seeding failed:", err);
  process.exit(1);
});

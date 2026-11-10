import mongoose from "mongoose";

async function syncDb() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB Atlas");

  const db = mongoose.connection.db;

  // 1. Update Page collection
  const homeUpdate = await db.collection("pages").updateOne(
    { slug: "home" },
    {
      $set: {
        title: "VIJOY POWER SOLUTION — Premier Solar EPC",
        heroHeading: "Professional Solar Panel Installation Services Across India",
        heroSubtitle:
          "Vijoy Power Solution delivers reliable solar panel supply and installation solutions for residential, commercial, industrial, and agricultural requirements across India.",
        isPublished: true,
        sections: [
          {
            sectionId: "home-hero",
            sectionType: "hero",
            title: "Professional Solar Panel Installation Services Across India",
            badgeText: "Certified Solar EPC • Serving Customers Across India",
            isVisible: true,
            sortOrder: 1,
          },
        ],
        updatedAt: new Date(),
      },
    }
  );
  console.log("Pages home updated:", homeUpdate.modifiedCount);

  const aboutUpdate = await db.collection("pages").updateOne(
    { slug: "about" },
    {
      $set: {
        heroSubtitle:
          "Delivering clean, dependable solar rooftop engineering, ALMM-compliant panel supply, and seamless DISCOM net-metering across India.",
        updatedAt: new Date(),
      },
    }
  );
  console.log("Pages about updated:", aboutUpdate.modifiedCount);

  const contactUpdate = await db.collection("pages").updateOne(
    { slug: "contact" },
    {
      $set: {
        heroSubtitle:
          "Reach out to our certified solar engineering and technical support teams. We are available Monday through Saturday across India.",
        updatedAt: new Date(),
      },
    }
  );
  console.log("Pages contact updated:", contactUpdate.modifiedCount);

  const subsidyUpdate = await db.collection("pages").updateOne(
    { slug: "subsidy-information" },
    {
      $set: {
        heroSubtitle:
          "Educational guide to national financial assistance, eligibility guidelines, DISCOM technical requirements, and step-by-step application workflow for rooftop solar across India.",
        updatedAt: new Date(),
      },
    }
  );
  console.log("Pages subsidy updated:", subsidyUpdate.modifiedCount);

  // 2. Update Settings homepage
  await db.collection("settings").updateOne(
    { key: "homepage" },
    {
      $set: {
        "value.hero.badge": "Certified Solar EPC • Serving Customers Across India",
        "value.hero.headline": "Professional Solar Panel Installation Services Across India",
        "value.hero.subheading":
          "Vijoy Power Solution delivers reliable solar panel supply and installation solutions for residential, commercial, industrial, and agricultural requirements across India.",
        "value.hero.checkpoints": [
          "Modules from 10W to 730W",
          "Up to ₹78,000 Govt Subsidy Guidance",
          "Heavy-Duty Hot-Dip Galvanized Mounts",
          "25-Year Linear Power Warranty",
        ],
        "value.hero.ctaPrimaryText": "Get Free Solar Consultation",
        "value.hero.ctaPrimaryLink": "/get-quote",
        "value.hero.ctaSecondaryText": "Explore Real Installations",
        "value.hero.ctaSecondaryLink": "/projects",
        "value.hero.transparencyNote":
          "Strict Transparency: No hidden costs. Zero public pricing fabrication. Private quotations only.",
        updatedAt: new Date(),
      },
    }
  );
  console.log("Setting homepage updated");

  // 3. Update solar products descriptions
  const products = await db.collection("solarproducts").find({}).toArray();
  for (const prod of products) {
    if (prod.description && prod.description.includes("Bihar, Jharkhand, and Uttar Pradesh")) {
      const updated = prod.description.replace(/Bihar, Jharkhand, and Uttar Pradesh/g, "India");
      await db.collection("solarproducts").updateOne({ _id: prod._id }, { $set: { description: updated } });
    }
  }
  console.log("Solar products descriptions checked & sanitized");

  // 4. Update solarsolutions descriptions
  const solutions = await db.collection("solarsolutions").find({}).toArray();
  for (const sol of solutions) {
    if (sol.description && sol.description.includes("Bihar, Jharkhand, and Uttar Pradesh")) {
      const updated = sol.description.replace(/Bihar, Jharkhand, and Uttar Pradesh/g, "India");
      await db.collection("solarsolutions").updateOne({ _id: sol._id }, { $set: { description: updated } });
    }
  }
  console.log("Solar solutions descriptions checked & sanitized");

  // 5. Update solarservices serviceableStates
  const servRes = await db.collection("solarservices").updateMany(
    {},
    {
      $set: {
        serviceableStates: [
          "Pan India",
          "Bihar",
          "Jharkhand",
          "Uttar Pradesh",
          "West Bengal",
          "Odisha",
          "Delhi NCR",
          "Rajasthan",
          "Maharashtra",
          "All States & UTs",
        ],
      },
    }
  );
  console.log("Solar services updated:", servRes.modifiedCount);

  console.log("ALL DATABASE UPDATES COMPLETED SUCCESSFULLY!");
  process.exit(0);
}

syncDb().catch((e) => {
  console.error(e);
  process.exit(1);
});

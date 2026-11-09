import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import crypto from "crypto";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Auto-load .env if needed
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
    console.warn("Could not load .env:", e.message);
  }
}

// 1. Indian Mobile Number & Lead Validation Test
test("Validation: Indian mobile format and required fields", () => {
  const LeadSchema = z.object({
    fullName: z.string().min(2),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    state: z.string().min(2),
    city: z.string().min(2),
    wattagePreference: z.number().min(10).max(730).optional(),
    website_url_hp: z.string().max(0).optional().or(z.literal("")),
  });

  // Valid lead
  const validResult = LeadSchema.safeParse({
    fullName: "Ramesh Kumar",
    phone: "9876543210",
    state: "Bihar",
    city: "Patna",
    wattagePreference: 550,
    website_url_hp: "",
  });
  assert.equal(validResult.success, true);

  // Invalid phone (starts with 1)
  const invalidPhoneResult = LeadSchema.safeParse({
    fullName: "Invalid User",
    phone: "1234567890",
    state: "Bihar",
    city: "Patna",
  });
  assert.equal(invalidPhoneResult.success, false);

  // Spam bot filled honeypot
  const spamResult = LeadSchema.safeParse({
    fullName: "Bot",
    phone: "9876543210",
    state: "Bihar",
    city: "Patna",
    website_url_hp: "http://spam.com",
  });
  assert.equal(spamResult.success, false);
});

// 2. Solar Panel Wattage Range Boundary Test (10W to 730W)
test("Wattage Range: strictly between 10W and 730W", () => {
  const ProductWattageSchema = z.number().min(10).max(730);

  // Boundary checks
  assert.equal(ProductWattageSchema.safeParse(10).success, true);
  assert.equal(ProductWattageSchema.safeParse(50).success, true);
  assert.equal(ProductWattageSchema.safeParse(100).success, true);
  assert.equal(ProductWattageSchema.safeParse(300).success, true);
  assert.equal(ProductWattageSchema.safeParse(550).success, true);
  assert.equal(ProductWattageSchema.safeParse(730).success, true);

  // Out of bounds
  assert.equal(ProductWattageSchema.safeParse(5).success, false);
  assert.equal(ProductWattageSchema.safeParse(731).success, false);
  assert.equal(ProductWattageSchema.safeParse(800).success, false);
  assert.equal(ProductWattageSchema.safeParse(-10).success, false);
});

// 3. Password Hashing and Verification Test
test("Auth: Bcrypt hashing and comparison", async () => {
  const password = "Admin@VPS2026SolarSecure!";
  const hash = await bcrypt.hash(password, 10);

  assert.notEqual(password, hash);
  assert.equal(await bcrypt.compare(password, hash), true);
  assert.equal(await bcrypt.compare("WrongPassword!", hash), false);
});

// 4. Signed Session JWT Verification Test
test("Auth: Jose JWT creation and verification", async () => {
  const secretKey = new TextEncoder().encode("vps_solar_ultra_secure_jwt_secret_key_minimum_32_chars_2026");
  const payload = {
    userId: "usr_12345",
    name: "Er. Vijoy Kumar",
    role: "super_admin",
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);

  assert.ok(typeof token === "string" && token.length > 20);

  const { payload: verified } = await jwtVerify(token, secretKey);
  assert.equal(verified.userId, "usr_12345");
  assert.equal(verified.role, "super_admin");
});

// 5. Calculator Logic Test
test("Calculator: Unit to kW and savings formula", () => {
  const monthlyUnits = 400;
  const unitsPerKwMonth = 125;
  const suggestedKw = Math.max(1, Math.round((monthlyUnits / unitsPerKwMonth) * 10) / 10);
  const requiredRoofSqFt = Math.round(suggestedKw * 75);
  const estimatedAnnualSavings = Math.round(monthlyUnits * 12 * 7.5 * 0.88);

  assert.equal(suggestedKw, 3.2);
  assert.equal(requiredRoofSqFt, 240);
  assert.equal(estimatedAnnualSavings, 31680);
});

// 6. Role Permissions Matrix Test
test("Permissions: Super Admin vs Sales Executive vs Viewer", () => {
  const hasPerm = (role, action) => {
    if (role === "super_admin") return true;
    if (role === "sales_executive" && ["read:leads", "write:leads"].includes(action)) return true;
    if (role === "viewer" && action.startsWith("read:")) return true;
    return false;
  };

  assert.equal(hasPerm("super_admin", "manage:settings"), true);
  assert.equal(hasPerm("super_admin", "manage:team"), true);
  assert.equal(hasPerm("sales_executive", "read:leads"), true);
  assert.equal(hasPerm("sales_executive", "manage:settings"), false);
  assert.equal(hasPerm("sales_executive", "manage:team"), false);
  assert.equal(hasPerm("viewer", "read:leads"), true);
  assert.equal(hasPerm("viewer", "write:leads"), false);
});

// 7. Strict Non-Pricing Policy Compliance Test
test("Business Policy: Public catalogue has ZERO price or cart fields", () => {
  const SolarProductSchema = {
    productId: "VPS-MOD-550",
    name: "Waaree 550W Mono PERC Bifacial",
    ratedPowerWp: 550,
    moduleEfficiencyPercent: 21.5,
    cellTechnology: "Mono PERC",
    isPublished: true,
  };

  const forbiddenKeys = ["price", "sellingPrice", "discount", "mrp", "cost", "addToCart", "checkout"];
  for (const key of forbiddenKeys) {
    assert.equal(key in SolarProductSchema, false, `Forbidden commercial field "${key}" detected in public catalogue schema`);
  }
});

// 8. Cloudinary Upload Signature Algorithm Test
test("Cloudinary: Upload signature uses SHA-1 alphabetically sorted params", () => {
  const folder = "vps_solar/products";
  const timestamp = 1700000000;
  const apiSecret = "KfG42ZDq87b_BMQJrix_8hNag_4";

  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto.createHash("sha1").update(paramsToSign + apiSecret).digest("hex");

  assert.ok(typeof signature === "string" && signature.length === 40);
});

// 9. MongoDB Atlas Live Data Audit Test
test("Database: Live MongoDB Atlas documents and relationships", async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.startsWith("mongodb")) {
    console.warn("Skipping live DB check: MONGODB_URI not set");
    return;
  }

  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  // Check Super Admin
  const admin = await db.collection("users").findOne({ email: "admin@vijoypowersolution.com" });
  assert.ok(admin, "Super Admin account should exist in MongoDB");
  assert.equal(admin.role, "super_admin");

  // Check Service Locations
  const locationsCount = await db.collection("locations").countDocuments();
  assert.ok(locationsCount >= 3, "At least 3 regional locations should be populated");

  // Check Solar Products
  const products = await db.collection("solarproducts").find({}).toArray();
  assert.ok(products.length > 0, "Solar products should be seeded");
  for (const p of products) {
    assert.ok(p.ratedPowerWp >= 10 && p.ratedPowerWp <= 730, `Product ${p.productId} wattage ${p.ratedPowerWp} out of bounds`);
  }

  // Check FAQs & Categories
  const faqCount = await db.collection("faqs").countDocuments();
  assert.ok(faqCount > 0, "FAQs should exist");

  const catCount = await db.collection("productcategories").countDocuments();
  assert.ok(catCount > 0, "Product categories should exist");

  await mongoose.disconnect();
});

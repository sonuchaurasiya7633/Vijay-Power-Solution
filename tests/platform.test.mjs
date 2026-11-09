import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";

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

  assert.equal(ProductWattageSchema.safeParse(10).success, true);
  assert.equal(ProductWattageSchema.safeParse(550).success, true);
  assert.equal(ProductWattageSchema.safeParse(730).success, true);

  // Below minimum
  assert.equal(ProductWattageSchema.safeParse(5).success, false);
  // Above maximum
  assert.equal(ProductWattageSchema.safeParse(800).success, false);
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
test("Permissions: Super Admin vs Sales Executive", () => {
  const hasPerm = (role, action) => {
    if (role === "super_admin") return true;
    if (role === "sales_executive" && ["read:leads", "write:leads"].includes(action)) return true;
    return false;
  };

  assert.equal(hasPerm("super_admin", "manage:settings"), true);
  assert.equal(hasPerm("super_admin", "manage:team"), true);
  assert.equal(hasPerm("sales_executive", "read:leads"), true);
  assert.equal(hasPerm("sales_executive", "manage:settings"), false);
  assert.equal(hasPerm("sales_executive", "manage:team"), false);
});

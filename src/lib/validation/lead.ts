import { z } from "zod";

export const LeadCaptureSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  whatsappPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian WhatsApp number")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  state: z.string().min(2, "State is required"),
  district: z.string().optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().optional().or(z.literal("")),
  installationAddress: z.string().optional().or(z.literal("")),
  customerType: z
    .enum(["residential", "commercial", "industrial", "agricultural", "institutional", "other"])
    .default("residential"),
  enquiryType: z.string().default("general"),
  solarSolutionType: z.string().optional().or(z.literal("")),
  productId: z.string().optional().or(z.literal("")),
  productName: z.string().optional().or(z.literal("")),
  wattagePreference: z
    .number()
    .min(10, "Minimum wattage is 10W")
    .max(730, "Maximum wattage is 730W")
    .optional(),
  requiredSystemSizeKw: z.number().positive().optional(),
  monthlyBillAmount: z.number().positive().optional(),
  monthlyUnitsConsumed: z.number().positive().optional(),
  roofType: z.string().optional().or(z.literal("")),
  roofAreaSqFt: z.number().positive().optional(),
  preferredConsultationDate: z.string().optional().or(z.literal("")),
  message: z.string().max(1000).optional().or(z.literal("")),
  leadSource: z.string().default("website_form"),
  landingPage: z.string().optional().or(z.literal("")),
  utmSource: z.string().optional().or(z.literal("")),
  utmMedium: z.string().optional().or(z.literal("")),
  utmCampaign: z.string().optional().or(z.literal("")),
  utmContent: z.string().optional().or(z.literal("")),
  utmTerm: z.string().optional().or(z.literal("")),
  referrer: z.string().optional().or(z.literal("")),
  // Honeypot field for spam bots
  website_url_hp: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type LeadCaptureInput = z.infer<typeof LeadCaptureSchema>;

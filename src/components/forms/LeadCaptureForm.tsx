"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import toast from "@/lib/toast";
import { SolarEmblemSpinner } from "@/components/ui/SolarLoader";
import { INDIAN_STATES_AND_UTS } from "@/lib/constants/states";
import { trackConversionEvent } from "@/lib/analytics-client";
import { AnimatePresence, motion } from "framer-motion";
import { VPS_EASE } from "@/components/ui/MotionPrimitives";

interface LeadCaptureFormProps {
  defaultEnquiryType?: string;
  defaultSolution?: string;
  defaultProductId?: string;
  defaultProductName?: string;
  defaultWattage?: number;
  compact?: boolean;
  buttonText?: string;
  onSuccess?: (leadId: string) => void;
}

export default function LeadCaptureForm({
  defaultEnquiryType = "general",
  defaultSolution = "Residential Rooftop Solar",
  defaultProductId,
  defaultProductName,
  defaultWattage,
  compact = false,
  buttonText = "Request Free Solar Consultation",
  onSuccess,
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    state: "Delhi (NCT)",
    city: "",
    customerType: "residential",
    solarSolutionType: defaultSolution,
    monthlyBillAmount: "",
    message: "",
    website_url_hp: "", // Honeypot
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Quick Indian phone validation
    const cleanPhone = formData.phone.trim();
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      const err = "Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)";
      setErrorMsg(err);
      toast.warning(err);
      return;
    }

    if (!formData.city.trim()) {
      const err = "Please enter your city/district";
      setErrorMsg(err);
      toast.warning(err);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phone: cleanPhone,
        state: formData.state,
        city: formData.city.trim(),
        customerType: formData.customerType,
        enquiryType: defaultEnquiryType,
        solarSolutionType: formData.solarSolutionType,
        productId: defaultProductId,
        productName: defaultProductName,
        wattagePreference: defaultWattage,
        monthlyBillAmount: formData.monthlyBillAmount ? Number(formData.monthlyBillAmount) : undefined,
        message: formData.message.trim(),
        leadSource: compact ? "hero_compact_form" : "website_consultation_form",
        landingPage: typeof window !== "undefined" ? window.location.pathname : "/",
        website_url_hp: formData.website_url_hp,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed. Please check your details.");
      }

      toast.submitted("Submitted successfully!", `Our solar engineer will contact you shortly. Ref: ${data.leadId}`);
      trackConversionEvent("generate_lead", {
        enquiryType: defaultEnquiryType,
        solarSolutionType: formData.solarSolutionType,
        state: formData.state,
        source: compact ? "hero_compact_form" : "website_consultation_form",
      });
      setSubmittedLeadId(data.leadId);
      if (onSuccess) onSuccess(data.leadId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit enquiry. Please try again or call us directly.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submittedLeadId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: VPS_EASE }}
        className="bg-solar-green-light/80 border border-solar-green/30 rounded-2xl p-6 text-center space-y-4"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.32, delay: 0.06, ease: VPS_EASE }}
          className="w-12 h-12 bg-solar-green text-white rounded-full flex items-center justify-center mx-auto shadow-md"
        >
          <CheckCircle2 className="w-6 h-6" />
        </motion.div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-navy-800">Enquiry Received Successfully!</h3>
          <p className="text-xs text-slate-muted">
            Your Lead Reference ID is <strong className="text-solar-green font-mono text-sm">{submittedLeadId}</strong>
          </p>
        </div>
        <p className="text-xs text-navy-800 leading-relaxed max-w-sm mx-auto">
          Our authorized solar technical expert for <strong>{formData.city}, {formData.state}</strong> has been notified and will contact you via phone or WhatsApp within 24 working hours.
        </p>
        <button
          onClick={() => {
            setSubmittedLeadId(null);
            setFormData({
              fullName: "",
              phone: "",
              state: "Delhi (NCT)",
              city: "",
              customerType: "residential",
              solarSolutionType: defaultSolution,
              monthlyBillAmount: "",
              message: "",
              website_url_hp: "",
            });
          }}
          className="text-xs font-semibold text-solar-green hover:underline pt-2 inline-block"
        >
          Submit another requirement
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
      {/* Honeypot field (hidden from real users) */}
      <input
        type="text"
        name="website_url_hp"
        value={formData.website_url_hp}
        onChange={(e) => setFormData({ ...formData, website_url_hp: e.target.value })}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: VPS_EASE }}
            className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name and Phone */}
      <div className={compact ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
        <div>
          <label className="block text-xs font-semibold text-navy-800 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Ramesh Kumar"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-border focus:border-solar-green focus:ring-2 focus:ring-solar-green/20 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy-800 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-muted">
              +91
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^\d]/g, "") })}
              className="w-full text-sm pl-11 pr-3.5 py-2.5 rounded-xl border border-slate-border focus:border-solar-green focus:ring-2 focus:ring-solar-green/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* State and City */}
      <div className={compact ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
        <div>
          <label className="block text-xs font-semibold text-navy-800 mb-1">
            Service State <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-border focus:border-solar-green focus:ring-2 focus:ring-solar-green/20 outline-none bg-white transition-all"
          >
            {INDIAN_STATES_AND_UTS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy-800 mb-1">
            City / Town <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Delhi, Mumbai, Bengaluru, Patna"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-border focus:border-solar-green focus:ring-2 focus:ring-solar-green/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Customer Type & Solution */}
      <div className={compact ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
        <div>
          <label className="block text-xs font-semibold text-navy-800 mb-1">
            Customer Category
          </label>
          <select
            value={formData.customerType}
            onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-border focus:border-solar-green focus:ring-2 focus:ring-solar-green/20 outline-none bg-white transition-all"
          >
            <option value="residential">Residential Rooftop</option>
            <option value="commercial">Commercial / Hospital / School</option>
            <option value="industrial">Industrial Mill / Cold Storage</option>
            <option value="agricultural">Agricultural / Solar Pump</option>
            <option value="other">Other Solar Project</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy-800 mb-1">
            Monthly Electricity Bill (₹ Approx)
          </label>
          <input
            type="number"
            placeholder="e.g. 4500"
            value={formData.monthlyBillAmount}
            onChange={(e) => setFormData({ ...formData, monthlyBillAmount: e.target.value })}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-border focus:border-solar-green focus:ring-2 focus:ring-solar-green/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Message / specific requirement */}
      {!compact && (
        <div>
          <label className="block text-xs font-semibold text-navy-800 mb-1">
            Specific Requirement / Rooftop Area Notes (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Tell us about your roof type (RCC / Tin), sanctioned load, or preferred panel brands..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-border focus:border-solar-green focus:ring-2 focus:ring-solar-green/20 outline-none transition-all"
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-solar-green text-white hover:bg-solar-green-hover shadow-lg shadow-solar-green/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 cursor-pointer"
      >
        {loading ? (
          <>
            <SolarEmblemSpinner size="sm" variant="white" label="Submitting solar enquiry" />
            <span>Connecting with Solar Engineer...</span>
          </>
        ) : (
          <>
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-[11px] text-slate-muted text-center flex items-center justify-center gap-1">
        <Sparkles className="w-3 h-3 text-solar-yellow" />
        <span>100% Free Consultation. No spam. Strict privacy protected.</span>
      </p>
    </form>
  );
}

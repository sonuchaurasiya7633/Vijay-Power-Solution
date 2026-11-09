import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle, ShieldCheck } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import connectDB from "@/lib/db/connection";
import Setting from "@/models/Setting";
import Page from "@/models/Page";

export const metadata: Metadata = {
  title: "Contact Us & Regional Offices | VIJOY POWER SOLUTION",
  description:
    "Contact VIJOY POWER SOLUTION for rooftop solar consultation, engineering surveys, and net metering assistance across Bihar, Jharkhand, and Uttar Pradesh.",
};

export const revalidate = 60;

export default async function ContactPage() {
  let settings: any = {
    companyName: "VIJOY POWER SOLUTION",
    phone: "+91 94310 00000",
    whatsapp: "919431000000",
    email: "contact@vijoypowersolution.com",
    address: "Main Road, Near Power Grid Substation, Gaya, Bihar - 823001",
    workingHours: "Monday – Saturday: 9:00 AM – 7:00 PM IST (Sunday closed)",
  };
  let pageContent: any = null;

  try {
    await connectDB();
    const [settingDoc, pageDoc] = await Promise.all([
      Setting.findOne({ key: "general" }).lean(),
      Page.findOne({ slug: "contact", isPublished: true }).lean(),
    ]);
    if (settingDoc && settingDoc.value) {
      settings = { ...settings, ...(settingDoc.value as object) };
    }
    if (pageDoc) {
      pageContent = pageDoc;
    }
  } catch (err) {
    console.error("Error loading dynamic contact settings:", err);
  }

  const cleanPhone = settings.phone ? settings.phone.replace(/[^0-9+]/g, "") : "+919431000000";
  const cleanWa = settings.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, "") : "919431000000";

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            Direct Communication
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            {pageContent?.title || "Contact VIJOY POWER SOLUTION"}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {pageContent?.heroSubtitle ||
              "Reach out to our certified solar engineering and technical support teams. We are available Monday through Saturday across Bihar, Jharkhand, and Uttar Pradesh."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Official Contact Directory */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-green">
                Headquarters & Communication Hub
              </span>
              <h2 className="text-2xl font-bold font-display text-navy-800">
                Talk to a Regional Solar Consultant
              </h2>
              <p className="text-xs sm:text-sm text-slate-muted leading-relaxed">
                Whether you need a residential 3 kW rooftop setup or a 100 kW industrial captive plant, our team is ready to assist with technical calculations and on-site feasibility.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl border border-slate-border flex items-start gap-3.5 bg-slate-bg/40">
                <MapPin className="w-5 h-5 text-solar-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-navy-800">Corporate & Operational Office</h4>
                  <p className="text-slate-muted mt-1 leading-relaxed">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-border flex items-start gap-3.5 bg-slate-bg/40">
                <Phone className="w-5 h-5 text-solar-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-navy-800">Direct Telephone</h4>
                  <a href={`tel:${cleanPhone}`} className="text-solar-green font-bold text-base block mt-1 hover:underline">
                    {settings.phone}
                  </a>
                  <p className="text-[11px] text-slate-muted mt-0.5">Toll-free assistance & site survey scheduling</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-border flex items-start gap-3.5 bg-slate-bg/40">
                <MessageCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-navy-800">WhatsApp Support Desk</h4>
                  <a
                    href={`https://wa.me/${cleanWa}?text=Hello%20VIJOY%20POWER%20SOLUTION,%20I%20would%20like%20to%20enquire%20about%20solar%20installation.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 font-bold block mt-1 hover:underline"
                  >
                    Chat on {settings.phone || cleanWa}
                  </a>
                  <p className="text-[11px] text-slate-muted mt-0.5">Quick replies & document sharing</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-border flex items-start gap-3.5 bg-slate-bg/40">
                <Mail className="w-5 h-5 text-solar-yellow-hover shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-navy-800">Official Email</h4>
                  <a href={`mailto:${settings.email}`} className="text-navy-800 font-medium block mt-1 hover:underline">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-border flex items-start gap-3.5 bg-slate-bg/40">
                <Clock className="w-5 h-5 text-navy-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-navy-800">Working Hours</h4>
                  <p className="text-slate-muted mt-1 leading-relaxed">
                    {settings.workingHours || "Monday to Saturday: 9:00 AM – 7:00 PM IST (Sunday closed)"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-border shadow-xl space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
                  Priority Response
                </span>
                <h3 className="text-2xl font-display font-extrabold text-navy-800 mt-2">
                  Send Your Project Requirement
                </h3>
                <p className="text-xs text-slate-muted mt-1">
                  Fill out the details below. Our engineering desk will review your sanctioned load and get back to you with a structured proposal.
                </p>
              </div>

              <LeadCaptureForm defaultEnquiryType="contact_page" buttonText="Submit Solar Enquiry" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

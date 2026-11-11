import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle, Building2, ShieldCheck } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import connectDB from "@/lib/db/connection";
import Setting from "@/models/Setting";
import Page from "@/models/Page";
import SocialLinksBar from "@/components/public/SocialLinksBar";

export const metadata: Metadata = {
  title: "Contact Us & Regional Offices | VIJOY POWER SOLUTION",
  description:
    "Contact VIJOY POWER SOLUTION for rooftop solar consultation, engineering surveys, and net metering assistance across India.",
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
  let cmsContact: any = null;
  let socialLinks: any = null;

  try {
    await connectDB();
    const [generalDoc, contactDoc, pageDoc, hfDoc] = await Promise.all([
      Setting.findOne({ key: "general" }).lean(),
      Setting.findOne({ key: "contact_page" }).lean(),
      Page.findOne({ slug: "contact", isPublished: true }).lean(),
      Setting.findOne({ key: "header_footer" }).lean(),
    ]);

    if (generalDoc && generalDoc.value) {
      settings = { ...settings, ...(generalDoc.value as object) };
    }
    if (contactDoc && contactDoc.value) {
      cmsContact = contactDoc.value;
    }
    if (pageDoc) {
      pageContent = pageDoc;
    }
    if (hfDoc && hfDoc.value && (hfDoc.value as any).socialLinks) {
      socialLinks = (hfDoc.value as any).socialLinks;
    }
  } catch (err) {
    console.error("Error loading dynamic contact settings:", err);
  }

  const hq = cmsContact?.headquarters || {
    name: "Corporate Headquarters & Main Solar Yard",
    address: settings.address || "Main Road, Near Power Grid Substation, Gaya, Bihar - 823001",
    city: "Gaya",
    state: "Bihar",
    phone: settings.phone || "+91 94310 00000",
    email: settings.email || "contact@vijoypowersolution.com",
    operatingHours: settings.workingHours || "Monday – Saturday: 9:00 AM – 7:00 PM IST",
  };

  const branches = cmsContact?.branches || [
    {
      city: "Patna",
      state: "Bihar",
      title: "Patna Regional EPC Office",
      address: "Bailey Road, Saguna More, Danapur, Patna, Bihar - 801503",
      phone: "+91 94310 00001",
      contactPerson: "Er. Ramesh Pandey (Regional Manager)",
    },
    {
      city: "Ranchi",
      state: "Jharkhand",
      title: "Ranchi Liaison & Technical Center",
      address: "Harmu Bypass Road, Near Sahjanand Chowk, Ranchi, Jharkhand - 834002",
      phone: "+91 94310 00002",
      contactPerson: "Er. Ankit Kumar (Jharkhand Lead)",
    },
    {
      city: "Lucknow",
      state: "Uttar Pradesh",
      title: "Lucknow DISCOM & Project Desk",
      address: "Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh - 226010",
      phone: "+91 94310 00003",
      contactPerson: "Er. Priya Sharma (UP EPC Specialist)",
    },
  ];

  const mapEmbedUrl =
    cmsContact?.mapEmbedUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115668.75653422615!2d84.9255755!3d24.7954545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f32a514d4e3efb%3A0xbcf04fb5b8821cf3!2sGaya%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  const cleanPhone = (hq.phone || settings.phone || "+919431000000").replace(/[^0-9+]/g, "");
  const cleanWa = (cmsContact?.channels?.whatsappNumber || settings.whatsapp || "919431000000").replace(/[^0-9]/g, "");

  const heroBadge = cmsContact?.hero?.badge || "Direct Communication";
  const heroTitle = cmsContact?.hero?.title || pageContent?.title || "Contact VIJOY POWER SOLUTION";
  const heroSubtitle =
    cmsContact?.hero?.subtitle ||
    pageContent?.heroSubtitle ||
    "Reach out to our certified solar engineering and technical support teams. Serving customers across India with dedicated regional engineering and liaison desks.";

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            {heroBadge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            {heroTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {heroSubtitle}
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
                  <h4 className="font-bold text-navy-800">{hq.name}</h4>
                  <p className="text-slate-muted mt-1 leading-relaxed">
                    {hq.address}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-border flex items-start gap-3.5 bg-slate-bg/40">
                <Phone className="w-5 h-5 text-solar-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-navy-800">Direct Telephone</h4>
                  <a href={`tel:${cleanPhone}`} className="text-solar-green font-bold text-base block mt-1 hover:underline">
                    {hq.phone}
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
                    Chat on WhatsApp (+{cleanWa})
                  </a>
                  <p className="text-[11px] text-slate-muted mt-0.5">Quick replies & document sharing</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-border flex items-start gap-3.5 bg-slate-bg/40">
                <Mail className="w-5 h-5 text-solar-yellow-hover shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-navy-800">Official Email</h4>
                  <a href={`mailto:${hq.email}`} className="text-navy-800 font-medium block mt-1 hover:underline">
                    {hq.email}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-border flex items-start gap-3.5 bg-slate-bg/40">
                <Clock className="w-5 h-5 text-navy-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-navy-800">Working Hours</h4>
                  <p className="text-slate-muted mt-1 leading-relaxed">
                    {hq.operatingHours}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-border space-y-3 bg-slate-bg/40">
                <div>
                  <h4 className="font-bold text-navy-800">Follow Us on Social Media</h4>
                  <p className="text-[11px] text-slate-muted mt-0.5">
                    Watch completed solar installations, customer stories &amp; updates
                  </p>
                </div>
                <SocialLinksBar links={socialLinks} variant="light" showLabels />
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

        {/* Regional Branches Section (CMS Controlled) */}
        {branches && branches.length > 0 && (
          <div className="mt-20 pt-16 border-t border-slate-border space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
                Regional Presence
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-800">
                Our Regional Offices & Liaison Desks
              </h3>
              <p className="text-xs sm:text-sm text-slate-muted">
                Resident project engineers and DISCOM coordinators supporting installations across India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {branches.map((b: any, idx: number) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-navy-800 text-white flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
                      {b.state}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-navy-800">{b.title}</h4>
                    <p className="text-xs text-slate-muted mt-1">{b.address}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-solar-green" />
                      <a href={`tel:${b.phone?.replace(/[^0-9+]/g, "")}`} className="font-bold text-navy-800 hover:text-solar-green">
                        {b.phone}
                      </a>
                    </div>
                    {b.contactPerson && (
                      <p className="text-[11px] text-slate-400 pl-5">{b.contactPerson}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Google Maps Location */}
        {mapEmbedUrl && (
          <div className="mt-16 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-navy-800">
                  Headquarters Map & Location
                </h3>
                <p className="text-xs text-slate-muted">
                  Visit our solar yard & engineering office at Gaya, Bihar.
                </p>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-slate-border shadow-lg h-80 sm:h-96 w-full">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

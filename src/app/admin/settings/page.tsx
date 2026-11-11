"use client";

import { useState, useEffect } from "react";
import toast from "@/lib/toast";
import { Settings, Save, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [general, setGeneral] = useState({
    companyName: "VIJOY POWER SOLUTION",
    phone: "+91 94310 00000",
    whatsapp: "919431000000",
    email: "contact@vijoypowersolution.com",
    address: "Main Road, Near Power Grid Substation, Gaya, Bihar - 823001",
    workingHours: "Monday – Saturday: 9:00 AM – 7:00 PM IST",
  });

  const [calculator, setCalculator] = useState({
    dailySunHoursAverage: 4.8,
    unitsGeneratedPerKwMonthly: 125,
    defaultTariffPerUnitInr: 7.5,
    sqFtPerKw: 70,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings?.general) setGeneral(d.settings.general);
        if (d.settings?.calculator) setCalculator(d.settings.calculator);
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Promise.all([
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "general", value: general }),
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "calculator", value: calculator }),
        }),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.saved("Saved successfully!", "General information and solar calculator constants updated.");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Platform Configuration</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            System & Website Settings
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Configure business information, contact routing, and solar calculator formulas.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* General Business Info */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-border shadow-sm space-y-4">
          <h3 className="text-base font-bold text-navy-800">Business Identity & Contact Routing</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-navy-800 block mb-1">Company Trade Name</label>
              <input
                type="text"
                value={general.companyName}
                onChange={(e) => setGeneral({ ...general, companyName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-border font-bold outline-none focus:border-solar-green"
              />
            </div>
            <div>
              <label className="font-bold text-navy-800 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={general.phone}
                onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-navy-800 block mb-1">WhatsApp Number (e.g. 919431000000)</label>
              <input
                type="text"
                value={general.whatsapp}
                onChange={(e) => setGeneral({ ...general, whatsapp: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-navy-800 block mb-1">Inbound Enquiry Email</label>
              <input
                type="email"
                value={general.email}
                onChange={(e) => setGeneral({ ...general, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-bold text-navy-800 block mb-1">Office Address</label>
              <input
                type="text"
                value={general.address}
                onChange={(e) => setGeneral({ ...general, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
              />
            </div>
          </div>
        </div>

        {/* Calculator Assumptions */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-border shadow-sm space-y-4">
          <h3 className="text-base font-bold text-navy-800">Solar Calculator Assumptions</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-navy-800 block mb-1">Units Generated per kW / Month</label>
              <input
                type="number"
                value={calculator.unitsGeneratedPerKwMonthly}
                onChange={(e) => setCalculator({ ...calculator, unitsGeneratedPerKwMonthly: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-border font-bold outline-none focus:border-solar-green"
              />
            </div>
            <div>
              <label className="font-bold text-navy-800 block mb-1">Default DISCOM Slab Tariff (₹ / Unit)</label>
              <input
                type="number"
                step={0.1}
                value={calculator.defaultTariffPerUnitInr}
                onChange={(e) => setCalculator({ ...calculator, defaultTariffPerUnitInr: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-border font-bold outline-none focus:border-solar-green"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl font-bold text-xs bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-2 shadow-sm transition-transform active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>

        {saved && (
          <div className="p-3.5 rounded-xl bg-solar-green-light border border-solar-green/30 text-solar-green text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-solar-green" />
            <span>Platform settings updated successfully!</span>
          </div>
        )}
      </form>
    </div>
  );
}

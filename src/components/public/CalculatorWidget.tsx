"use client";

import { useState } from "react";
import { Sun, Zap, TrendingUp, Leaf, ShieldAlert, ArrowRight } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

export default function CalculatorWidget() {
  const [state, setState] = useState("Bihar");
  const [monthlyUnits, setMonthlyUnits] = useState(400);
  const [monthlyBill, setMonthlyBill] = useState(3000);
  const [roofType, setRoofType] = useState("Flat RCC Concrete");
  const [systemType, setSystemType] = useState("On-Grid (Net Metering)");
  const [showLeadModal, setShowLeadModal] = useState(false);

  // Solar calculations
  // Average daily generation per kW in Bihar/JH/UP is approx 4.2 to 4.5 kWh/day -> ~125-130 units/month per kW
  const unitsPerKwMonth = 125;
  const suggestedKw = Math.max(1, Math.round((monthlyUnits / unitsPerKwMonth) * 10) / 10);
  const requiredRoofSqFt = Math.round(suggestedKw * 75); // approx 75 sq ft per kW with high-efficiency 550W modules
  const annualGenerationUnits = Math.round(suggestedKw * 1500); // 1500 units per kW per year
  const estimatedAnnualSavings = Math.round(monthlyUnits * 12 * 7.5 * 0.88); // 88% offset at ~₹7.5/unit average tariff
  const co2AvoidedTonnes = Math.round((annualGenerationUnits * 0.82) / 100) / 10; // ~0.82 kg CO2 per kWh

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-border overflow-hidden">
      <div className="bg-navy-800 text-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-solar-green/20 border border-solar-green/30 flex items-center justify-center text-solar-yellow">
            <Sun className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow">
              Interactive Solar Engineering Tool
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              Solar Rooftop Feasibility & Savings Calculator
            </h3>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* State */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-800 mb-2">
              Select Installation State
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Bihar", "Jharkhand", "Uttar Pradesh"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setState(st)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    state === st
                      ? "bg-navy-800 text-white border-navy-800 shadow-sm"
                      : "bg-slate-bg text-navy-800 border-slate-border hover:bg-slate-100"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Units Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wide text-navy-800">
                Monthly Electricity Consumption (Units / kWh)
              </label>
              <span className="text-sm font-extrabold text-solar-green bg-solar-green-light px-3 py-1 rounded-lg">
                {monthlyUnits} Units
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={2500}
              step={50}
              value={monthlyUnits}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMonthlyUnits(val);
                setMonthlyBill(Math.round(val * 7.5));
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-solar-green"
            />
            <div className="flex justify-between text-[11px] text-slate-muted mt-1">
              <span>100 Units (Small Home)</span>
              <span>800 Units (Large Villa)</span>
              <span>2500+ Units (Commercial)</span>
            </div>
          </div>

          {/* Monthly Bill Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                Approximate Monthly Bill (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-muted">₹</span>
                <input
                  type="number"
                  value={monthlyBill}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMonthlyBill(val);
                    setMonthlyUnits(Math.round(val / 7.5));
                  }}
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-border focus:border-solar-green focus:ring-2 focus:ring-solar-green/20 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                Roof Construction
              </label>
              <select
                value={roofType}
                onChange={(e) => setRoofType(e.target.value)}
                className="w-full py-2.5 px-3 text-sm rounded-xl border border-slate-border bg-white focus:border-solar-green outline-none"
              >
                <option value="Flat RCC Concrete">Flat RCC Concrete Terrace</option>
                <option value="Tin / Metal Sheet">Industrial Tin / Metal Shed</option>
                <option value="Sloped Tile Roof">Sloped Tile Roof</option>
                <option value="Elevated Rooftop">Elevated Structure (Terrace Access)</option>
              </select>
            </div>
          </div>

          {/* System Preference */}
          <div>
            <label className="block text-xs font-semibold text-navy-800 mb-2">
              Recommended Solar Architecture Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { name: "On-Grid (Net Metering)", desc: "Lowest cost, exports surplus to DISCOM" },
                { name: "Hybrid (Solar + Battery)", desc: "Net metering + backup during outages" },
                { name: "Off-Grid Standalone", desc: "100% battery backup without grid export" },
              ].map((sys) => (
                <button
                  key={sys.name}
                  type="button"
                  onClick={() => setSystemType(sys.name)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    systemType === sys.name
                      ? "border-solar-green bg-solar-green-light/50 ring-2 ring-solar-green/20"
                      : "border-slate-border bg-white hover:bg-slate-50"
                  }`}
                >
                  <p className="text-xs font-bold text-navy-800 leading-tight">{sys.name}</p>
                  <p className="text-[10px] text-slate-muted mt-1 leading-snug">{sys.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-navy-50/70 p-6 rounded-2xl border border-navy-100 space-y-6">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-1 rounded-full">
              Estimated System Specifications
            </span>

            {/* Suggested kW */}
            <div className="bg-white p-4 rounded-xl border border-slate-border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-muted">Recommended Solar Capacity</p>
                <h4 className="text-2xl font-black text-navy-800">{suggestedKw} kW</h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-solar-yellow/20 flex items-center justify-center text-solar-yellow-hover">
                <Zap className="w-5 h-5 fill-current" />
              </div>
            </div>

            {/* Roof Area Needed */}
            <div className="bg-white p-4 rounded-xl border border-slate-border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-muted">Shadow-Free Roof Area Required</p>
                <h4 className="text-xl font-black text-navy-800">~{requiredRoofSqFt} sq. ft.</h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center text-navy-800">
                <Sun className="w-5 h-5" />
              </div>
            </div>

            {/* Annual Generation & Savings */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-border shadow-sm">
                <p className="text-[11px] text-slate-muted">Est. Annual Generation</p>
                <p className="text-base font-extrabold text-navy-800">{annualGenerationUnits.toLocaleString()} kWh</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-border shadow-sm">
                <p className="text-[11px] text-slate-muted">Est. Annual Savings</p>
                <p className="text-base font-extrabold text-solar-green">₹{estimatedAnnualSavings.toLocaleString()}</p>
              </div>
            </div>

            {/* CO2 Metric */}
            <div className="flex items-center gap-2 text-xs text-navy-800 bg-white p-3 rounded-xl border border-slate-border">
              <Leaf className="w-4 h-4 text-solar-green shrink-0" />
              <span>Reduces ~<strong>{co2AvoidedTonnes} tonnes</strong> CO2 greenhouse emissions yearly.</span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => setShowLeadModal(true)}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-solar-green text-white hover:bg-solar-green-hover shadow-md shadow-solar-green/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Get My Detailed Solar Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-1.5 text-[11px] text-slate-muted leading-tight">
              <ShieldAlert className="w-3.5 h-3.5 text-solar-yellow shrink-0 mt-0.5" />
              <span>
                Calculation based on average {state} solar irradiance and ₹7.5/unit DISCOM tariff. Exact generation confirmed after physical site survey. No online checkout.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal to submit calculated lead */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-border relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowLeadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-navy-800 font-bold text-lg w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="mb-4">
              <span className="text-xs font-bold text-solar-green uppercase tracking-wider">
                Step 2: Reserve Consultation
              </span>
              <h4 className="text-xl font-display font-extrabold text-navy-800">
                Claim Your Customized Solar Report
              </h4>
              <p className="text-xs text-slate-muted mt-1">
                We will prepare a customized technical proposal for <strong>{suggestedKw} kW</strong> in <strong>{state}</strong>.
              </p>
            </div>
            <LeadCaptureForm
              defaultEnquiryType="calculator"
              defaultSolution={`${systemType} (${suggestedKw} kW)`}
              buttonText="Confirm & Receive Detailed Proposal"
              onSuccess={() => {
                setTimeout(() => setShowLeadModal(false), 4000);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

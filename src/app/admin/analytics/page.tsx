"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, CheckCircle2, Phone, MessageCircle, MapPin, Loader2 } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-20 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
        <span>Loading analytics metrics...</span>
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Conversion Performance</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Analytics & Conversion Funnel
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Privacy-preserving conversion metrics distinguishing between landing visits, enquiries, surveys, and won projects.
          </p>
        </div>
      </div>

      {/* Funnel Progress Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-border shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-muted">Total Enquiries</span>
          <h3 className="text-2xl font-extrabold font-display text-navy-800">{metrics.totalLeads || 0}</h3>
          <span className="text-[10px] text-solar-green font-bold">Inbound CRM Pipeline</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-border shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-muted">Scheduled Surveys</span>
          <h3 className="text-2xl font-extrabold font-display text-purple-700">{metrics.scheduledSurveys || 0}</h3>
          <span className="text-[10px] text-slate-muted font-bold">Physical Roof Feasibility</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-border shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-muted">Active Installations</span>
          <h3 className="text-2xl font-extrabold font-display text-indigo-700">{metrics.activeInstallations || 0}</h3>
          <span className="text-[10px] text-slate-muted font-bold">EPC Construction</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-border shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-muted">Won Installations</span>
          <h3 className="text-2xl font-extrabold font-display text-emerald-700">{metrics.wonLeads || 0}</h3>
          <span className="text-[10px] text-emerald-700 font-bold">Converted Customers</span>
        </div>
      </div>

      {/* Geographic Breakdown Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-navy-800">Geographic Enquiry Demand</h3>
        <div className="space-y-3">
          {data?.stateBreakdown?.map((item: any) => {
            const count = item.count;
            const pct = metrics.totalLeads > 0 ? Math.round((count / metrics.totalLeads) * 100) : 0;
            return (
              <div key={item._id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-navy-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-solar-green" />
                    <span>{item._id || "Other / Online"}</span>
                  </span>
                  <span className="text-slate-muted font-mono">{count} leads ({pct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-solar-green rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

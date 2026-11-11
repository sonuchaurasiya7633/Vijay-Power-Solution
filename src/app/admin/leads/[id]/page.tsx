"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "@/lib/toast";
import {
  User,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Clock,
  ClipboardCheck,
  FileSpreadsheet,
  HardHat,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
} from "lucide-react";
import { formatDateIST, formatDateTimeIST } from "@/lib/utils/formatters";
import { SolarPanelLoader } from "@/components/ui/SolarLoader";

export default function LeadDetailPage() {
  const { id } = useParams() as { id: string };
  const [leadData, setLeadData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [updatingStage, setUpdatingStage] = useState(false);
  const [submittingNote, setSubmittingNote] = useState(false);

  const fetchDetail = async () => {
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLeadData(data);
      }
    } catch (err) {
      console.error("Fetch lead detail error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleStageChange = async (newStage: string) => {
    setUpdatingStage(true);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      if (res.ok) {
        toast.updated("Updated successfully!", `Pipeline stage moved to "${newStage.replace(/_/g, " ")}".`);
        fetchDetail();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to update pipeline stage");
      }
    } catch (err: any) {
      console.error("Update stage error:", err);
      toast.error(err.message || "Failed to update pipeline stage");
    } finally {
      setUpdatingStage(false);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      });
      if (res.ok) {
        toast.updated("Updated successfully!", `Lead priority set to "${newPriority.toUpperCase()}".`);
        fetchDetail();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to update priority");
      }
    } catch (err: any) {
      console.error("Update priority error:", err);
      toast.error(err.message || "Failed to update priority");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSubmittingNote(true);
    try {
      const res = await fetch(`/api/leads/${id}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityType: "note_added",
          title: "Staff Internal Note",
          description: noteText.trim(),
        }),
      });
      if (res.ok) {
        toast.saved("Saved successfully!", "Internal note attached to lead.");
        setNoteText("");
        fetchDetail();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to add internal note");
      }
    } catch (err: any) {
      console.error("Add note error:", err);
      toast.error(err.message || "Failed to add note");
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleLogCall = async () => {
    const outcome = prompt("Enter call summary / outcome (e.g. Discussed 5kW system, customer interested in site survey):");
    if (!outcome) return;

    try {
      const res = await fetch(`/api/leads/${id}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityType: "call_logged",
          title: "Phone Call Completed",
          description: outcome,
        }),
      });
      if (res.ok) {
        toast.saved("Saved successfully!", "Call log recorded in lead history.");
        fetchDetail();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to record call log");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to record call log");
    }
  };

  if (loading) {
    return (
      <SolarPanelLoader
        title="Loading Lead Profile..."
        subtitle="Fetching activity timeline, surveys, and private quotations"
      />
    );
  }

  if (!leadData || !leadData.lead) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-sm font-bold text-navy-800">Lead record not found</p>
        <Link href="/admin/leads" className="text-xs text-solar-green hover:underline">
          Return to All Leads
        </Link>
      </div>
    );
  }

  const { lead, activities = [], followUps = [], surveys = [], quotations = [] } = leadData;

  const waLink = `https://wa.me/91${lead.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    `Hello ${lead.fullName}, this is from VIJOY POWER SOLUTION regarding your rooftop solar enquiry (${lead.leadId}). When is a convenient time for a brief 5-minute technical consultation?`
  )}`;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-muted hover:text-navy-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Leads</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogCall}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-navy-800 text-white hover:bg-navy-900 flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-solar-yellow" />
            <span>Log Call Outcome</span>
          </button>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Open WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer Profile & Stages */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-extrabold text-navy-800 bg-slate-bg px-2.5 py-1 rounded-lg border border-slate-200">
                {lead.leadId}
              </span>
              <span className="text-[10px] text-slate-muted">
                Created: {formatDateIST(lead.createdAt)}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-display font-extrabold text-navy-800">
                {lead.fullName}
              </h2>
              <span className="text-xs text-solar-green font-bold uppercase tracking-wider block mt-0.5">
                {lead.customerType} Solar Enquiry
              </span>
            </div>

            {/* Stage Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-navy-800 block">
                CRM Pipeline Stage
              </label>
              <select
                disabled={updatingStage}
                value={lead.stage}
                onChange={(e) => handleStageChange(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-border bg-white text-navy-800 text-xs font-bold focus:border-solar-green outline-none"
              >
                <option value="new_lead">1. New Lead</option>
                <option value="contact_attempted">2. Contact Attempted</option>
                <option value="contacted">3. Contacted</option>
                <option value="qualified">4. Qualified</option>
                <option value="site_survey_requested">5. Site Survey Requested</option>
                <option value="site_survey_scheduled">6. Site Survey Scheduled</option>
                <option value="site_survey_completed">7. Site Survey Completed</option>
                <option value="quotation_preparation">8. Quotation Preparation</option>
                <option value="quotation_sent">9. Quotation Sent</option>
                <option value="negotiation">10. Negotiation</option>
                <option value="won">11. Won Customer</option>
                <option value="installation_scheduled">12. Installation Scheduled</option>
                <option value="installation_in_progress">13. Installation In Progress</option>
                <option value="installation_completed">14. Installation Completed</option>
                <option value="handover_completed">15. Handover Completed</option>
                <option value="lost">16. Lost</option>
                <option value="not_interested">17. Not Interested</option>
                <option value="invalid_duplicate">18. Invalid / Duplicate</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-800 block">
                Priority
              </label>
              <select
                value={lead.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-slate-border bg-white text-navy-800 text-xs font-semibold outline-none"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Contact details */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-muted">Phone:</span>
                <a href={`tel:${lead.phone}`} className="font-mono font-bold text-navy-800 hover:text-solar-green">
                  {lead.phone}
                </a>
              </div>
              {lead.email && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted">Email:</span>
                  <a href={`mailto:${lead.email}`} className="font-medium text-navy-800 hover:underline truncate max-w-xs">
                    {lead.email}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-muted">Location:</span>
                <span className="font-bold text-navy-800">{lead.city}, {lead.state}</span>
              </div>
              {lead.installationAddress && (
                <div className="flex items-start justify-between">
                  <span className="text-slate-muted">Address:</span>
                  <span className="text-right text-navy-800 max-w-xs">{lead.installationAddress}</span>
                </div>
              )}
            </div>

            {/* Requirement Details */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-muted">Solution Interest:</span>
                <strong className="text-navy-800">{lead.solarSolutionType || "General"}</strong>
              </div>
              {lead.productName && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted">Product Interest:</span>
                  <strong className="text-navy-800">{lead.productName} ({lead.wattagePreference}Wp)</strong>
                </div>
              )}
              {lead.monthlyBillAmount && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted">Monthly Bill:</span>
                  <strong className="text-navy-800">₹{lead.monthlyBillAmount.toLocaleString()}</strong>
                </div>
              )}
              {lead.roofType && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted">Roof Type:</span>
                  <strong className="text-navy-800">{lead.roofType}</strong>
                </div>
              )}
              {lead.message && (
                <div className="pt-2">
                  <span className="text-slate-muted block text-[11px] mb-1">Customer Note:</span>
                  <p className="p-3 rounded-xl bg-slate-bg border border-slate-200 text-navy-800 italic">
                    &ldquo;{lead.message}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Timeline, Activities & Notes */}
        <div className="lg:col-span-7 space-y-6">
          {/* Add Internal Note */}
          <div className="bg-white p-5 rounded-2xl border border-slate-border shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800">
              Add CRM Interaction Note
            </h3>
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={2}
                required
                placeholder="Log discussion notes, site constraints, customer budget notes..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingNote}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-1.5 transition-colors disabled:opacity-70"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </button>
              </div>
            </form>
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-navy-800">Lead Audit Timeline & Activity</h3>
            {activities.length === 0 ? (
              <p className="text-xs text-slate-muted">No interactions logged yet.</p>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {activities.map((act: any) => (
                  <div key={act._id} className="relative flex items-start gap-4 pl-8">
                    <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-solar-green ring-4 ring-white" />
                    <div className="space-y-0.5 flex-1 bg-slate-bg/50 p-3 rounded-xl border border-slate-border">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-navy-800">{act.title}</h4>
                        <span className="text-[10px] text-slate-muted">
                          {formatDateTimeIST(act.createdAt)}
                        </span>
                      </div>
                      {act.description && (
                        <p className="text-xs text-slate-muted leading-relaxed pt-1">
                          {act.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

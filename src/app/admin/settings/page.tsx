"use client";

import { useState, useEffect } from "react";
import toast from "@/lib/toast";
import {
  Settings,
  Save,
  CheckCircle2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

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

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  const [saved, setSaved] = useState(false);
  const [platformSaving, setPlatformSaving] = useState(false);

  // Password update form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdUpdating, setPwdUpdating] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);

  useEffect(() => {
    // 1. Fetch platform settings
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings?.general) setGeneral(d.settings.general);
        if (d.settings?.calculator) setCalculator(d.settings.calculator);
      })
      .catch(() => {});

    // 2. Fetch logged in user profile
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setCurrentUser(d.user);
      })
      .catch(() => {});
  }, []);

  const handleSavePlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlatformSaving(true);
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
      toast.saved(
        "Saved successfully!",
        "General information and solar calculator constants updated."
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setPlatformSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password.");
      return;
    }

    setPwdUpdating(true);
    setPwdSuccess(false);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPwdSuccess(true);
      setTimeout(() => setPwdSuccess(false), 5000);
      toast.saved(
        "Password Updated!",
        data.message || "Your account password has been changed successfully."
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setPwdUpdating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">
            Platform Configuration & Security
          </span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            System Settings & Security
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Manage company contact details, solar calculator formulas, and update your admin password.
          </p>
        </div>

        {currentUser && (
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-bg border border-slate-border text-xs">
            <div className="w-7 h-7 rounded-lg bg-navy-800 text-white font-bold flex items-center justify-center text-xs">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <p className="font-bold text-navy-800 leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-slate-muted font-mono capitalize">
                {currentUser.role.replace(/_/g, " ")} • {currentUser.email}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: Account Security & Password Update */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-border shadow-sm space-y-6">
        <div className="flex items-start justify-between border-b border-slate-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-solar-green-light text-solar-green flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-solar-green" />
            </div>
            <div>
              <h2 className="text-base font-bold text-navy-800">
                Admin Password & Security
              </h2>
              <p className="text-xs text-slate-muted">
                Update your administrative login password to keep your account secure.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-solar-green bg-solar-green-light px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Session</span>
          </span>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Current Password */}
            <div>
              <label className="font-bold text-navy-800 block mb-1">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className="w-full p-2.5 pr-9 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono text-xs transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-800"
                  tabIndex={-1}
                  aria-label={showCurrent ? "Hide current password" : "Show current password"}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="font-bold text-navy-800 block mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className="w-full p-2.5 pr-9 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono text-xs transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-800"
                  tabIndex={-1}
                  aria-label={showNew ? "Hide new password" : "Show new password"}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-muted mt-1">
                {newPassword.length > 0 && (
                  <span
                    className={
                      newPassword.length >= 8 ? "text-solar-green font-bold" : "text-amber-600 font-bold"
                    }
                  >
                    {newPassword.length >= 8
                      ? "✓ Valid length (8+ chars)"
                      : `${newPassword.length}/8 characters minimum`}
                  </span>
                )}
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="font-bold text-navy-800 block mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  className="w-full p-2.5 pr-9 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono text-xs transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-800"
                  tabIndex={-1}
                  aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-muted mt-1">
                {confirmPassword.length > 0 && (
                  <span
                    className={
                      confirmPassword === newPassword
                        ? "text-solar-green font-bold"
                        : "text-red-500 font-bold"
                    }
                  >
                    {confirmPassword === newPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={pwdUpdating}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-navy-800 hover:bg-navy-900 text-white flex items-center gap-2 shadow-sm transition-transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pwdUpdating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-solar-green" />
                  <span>Update Password</span>
                </>
              )}
            </button>

            {pwdSuccess && (
              <span className="text-xs text-solar-green font-bold flex items-center gap-1.5 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Password successfully changed!</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* SECTION 2: Platform & Website Configuration */}
      <form onSubmit={handleSavePlatform} className="space-y-6">
        {/* General Business Info */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-border shadow-sm space-y-4">
          <div className="border-b border-slate-border pb-3">
            <h2 className="text-base font-bold text-navy-800">
              Business Identity & Contact Routing
            </h2>
            <p className="text-xs text-slate-muted">
              Official company information displayed on headers, footers, and enquiry confirmations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-navy-800 block mb-1">Company Trade Name</label>
              <input
                type="text"
                value={general.companyName}
                onChange={(e) => setGeneral({ ...general, companyName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-border font-bold outline-none focus:border-solar-green text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-navy-800 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={general.phone}
                onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-navy-800 block mb-1">
                WhatsApp Number (e.g. 919431000000)
              </label>
              <input
                type="text"
                value={general.whatsapp}
                onChange={(e) => setGeneral({ ...general, whatsapp: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-navy-800 block mb-1">Inbound Enquiry Email</label>
              <input
                type="email"
                value={general.email}
                onChange={(e) => setGeneral({ ...general, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-bold text-navy-800 block mb-1">Office Address</label>
              <input
                type="text"
                value={general.address}
                onChange={(e) => setGeneral({ ...general, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green text-xs"
              />
            </div>
          </div>
        </div>

        {/* Calculator Assumptions */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-border shadow-sm space-y-4">
          <div className="border-b border-slate-border pb-3">
            <h2 className="text-base font-bold text-navy-800">
              Solar Calculator Assumptions
            </h2>
            <p className="text-xs text-slate-muted">
              Engineering constants used to estimate generation and bill savings on the public solar calculator.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-navy-800 block mb-1">
                Units Generated per kW / Month
              </label>
              <input
                type="number"
                value={calculator.unitsGeneratedPerKwMonthly}
                onChange={(e) =>
                  setCalculator({
                    ...calculator,
                    unitsGeneratedPerKwMonthly: Number(e.target.value),
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-border font-bold outline-none focus:border-solar-green text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-navy-800 block mb-1">
                Default DISCOM Slab Tariff (₹ / Unit)
              </label>
              <input
                type="number"
                step={0.1}
                value={calculator.defaultTariffPerUnitInr}
                onChange={(e) =>
                  setCalculator({
                    ...calculator,
                    defaultTariffPerUnitInr: Number(e.target.value),
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-border font-bold outline-none focus:border-solar-green text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={platformSaving}
            className="px-6 py-3 rounded-xl font-bold text-xs bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-2 shadow-sm transition-transform active:scale-95 disabled:opacity-60"
          >
            {platformSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Platform Settings</span>
          </button>

          {saved && (
            <div className="p-2.5 rounded-xl bg-solar-green-light border border-solar-green/30 text-solar-green text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-solar-green" />
              <span>Platform settings updated successfully!</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

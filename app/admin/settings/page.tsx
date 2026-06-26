"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";

export default function AdminSettingsPage() {
  const [maintenance, setMaintenance] = useState(false);
  const [registrations, setRegistrations] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveSettings = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maintenance, registrations, emailNotifications }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ value, onChange, label, description }: { value: boolean; onChange: () => void; label: string; description: string }) => (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div>
        <div className="text-white text-sm font-medium">{label}</div>
        <div className="text-slate-500 text-xs mt-0.5">{description}</div>
      </div>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${value ? "bg-amber-500" : "bg-white/10"}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${value ? "translate-x-6" : "translate-x-0.5"}`} />
      </button>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-slate-400 mt-1">Configure platform-wide settings and feature flags</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Platform Controls */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Platform Controls</h2>
          <Toggle
            value={maintenance}
            onChange={() => setMaintenance(!maintenance)}
            label="Maintenance Mode"
            description="When enabled, only admins can access the platform. Users see a maintenance page."
          />
          <Toggle
            value={registrations}
            onChange={() => setRegistrations(!registrations)}
            label="Open Registrations"
            description="Allow new users to sign up. Disable to pause new registrations."
          />
          <Toggle
            value={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
            label="Email Notifications"
            description="Send automated emails (welcome, connection alerts, password reset) via Resend."
          />
        </div>

        {/* Admin Access */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Admin Access</h2>
          <p className="text-slate-400 text-sm mb-4">
            Admin access is controlled by the <code className="text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded text-xs">ADMIN_EMAILS</code> list in{" "}
            <code className="text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded text-xs">app/admin/layout.tsx</code>.
          </p>
          <div className="bg-black/30 rounded-xl p-4 font-mono text-xs text-slate-300">
            <div className="text-slate-500 mb-2">// Current admin emails:</div>
            <div>princemaiga09@hotmail.com</div>
            <div>admin@afrimatch.app</div>
          </div>
          <p className="text-slate-500 text-xs mt-3">To add more admins, edit the ADMIN_EMAILS array in the admin layout file and redeploy.</p>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
          <h2 className="text-red-400 font-semibold mb-4">⚠️ Danger Zone</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-sm font-medium">Clear Cache</div>
                <div className="text-slate-500 text-xs">Force-clear all server-side caches</div>
              </div>
              <button className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-medium transition">
                Clear Cache
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-sm font-medium">Export User Data</div>
                <div className="text-slate-500 text-xs">Download all user data as CSV (GDPR compliance)</div>
              </div>
              <button className="px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl text-sm font-medium transition">
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={saveSettings}
          disabled={saving}
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3 rounded-xl transition disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "✅ Settings Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

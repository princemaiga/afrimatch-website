"use client";
"use client";
import { Navbar } from "@/components/navbar";
import { useTranslation } from "@/lib/i18n/use-translation";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "notifications" | "privacy" | "danger">("profile");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auth protection
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#f59e0b] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }

  const user = session?.user;

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "password", label: "Password", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "🛡️" },
    { id: "danger", label: "Danger Zone", icon: "⚠️" },
  ] as const;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    // Simulate save — in production this calls /api/account/update
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setMessage({ type: "success", text: "Settings saved successfully." });
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <Navbar />

      <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          <p className="text-white/60 mt-1">Manage your account preferences and security</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-green-500/20 border border-green-500/30 text-green-400"
              : "bg-red-500/20 border border-red-500/30 text-red-400"
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                    activeTab === tab.id
                      ? "bg-[#f59e0b] text-black"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  } ${tab.id === "danger" ? "mt-4 text-red-400 hover:text-red-300" : ""}`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-6">
            {activeTab === "profile" && (
              <form onSubmit={handleSave}>
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#f59e0b]/20 flex items-center justify-center text-2xl font-bold text-[#f59e0b]">
                      {user?.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="font-medium text-white">{user?.name ?? "Your Name"}</p>
                      <p className="text-white/50 text-sm">{user?.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Display Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name ?? ""}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#f59e0b] transition-colors"
                      placeholder="Your display name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user?.email ?? ""}
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/40 cursor-not-allowed"
                    />
                    <p className="text-xs text-white/40 mt-1">Email cannot be changed. Contact support if needed.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Country</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b] transition-colors">
                      <option value="">Select your country</option>
                      <option value="NG">Nigeria</option>
                      <option value="KE">Kenya</option>
                      <option value="GH">Ghana</option>
                      <option value="ZA">South Africa</option>
                      <option value="ET">Ethiopia</option>
                      <option value="EG">Egypt</option>
                      <option value="TZ">Tanzania</option>
                      <option value="SN">Senegal</option>
                      <option value="CI">Côte d&apos;Ivoire</option>
                      <option value="CM">Cameroon</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "password" && (
              <form onSubmit={handleSave}>
                <h2 className="text-xl font-semibold mb-6">Change Password</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#f59e0b] transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#f59e0b] transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#f59e0b] transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="text-xs text-white/40">Password must be at least 8 characters long.</p>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
                  >
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: "New connections", description: "Get notified when someone connects with you", defaultChecked: true },
                    { label: "New messages", description: "Get notified when you receive a message", defaultChecked: true },
                    { label: "Profile engagements", description: "Get notified when someone engages with your profile or sends a message", defaultChecked: true },
                    { label: "Job applications", description: "Updates on your job applications", defaultChecked: false },
                    { label: "Platform updates", description: "New features and announcements", defaultChecked: false },
                    { label: "Marketing emails", description: "Tips, promotions and special offers", defaultChecked: false },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/8 transition-colors">
                      <div>
                        <p className="font-medium text-white">{item.label}</p>
                        <p className="text-sm text-white/50">{item.description}</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={item.defaultChecked}
                        className="w-5 h-5 accent-[#f59e0b] cursor-pointer"
                      />
                    </label>
                  ))}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: "Show my profile to everyone", description: "Your profile is visible to all users", defaultChecked: true },
                    { label: "Show online status", description: "Let others see when you are online", defaultChecked: true },
                    { label: "Allow profile in search", description: "Your profile appears in search results", defaultChecked: true },
                    { label: "Show read receipts", description: "Let others know when you have read their messages", defaultChecked: false },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/8 transition-colors">
                      <div>
                        <p className="font-medium text-white">{item.label}</p>
                        <p className="text-sm text-white/50">{item.description}</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={item.defaultChecked}
                        className="w-5 h-5 accent-[#f59e0b] cursor-pointer"
                      />
                    </label>
                  ))}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "danger" && (
              <div>
                <h2 className="text-xl font-semibold mb-2 text-red-400">Danger Zone</h2>
                <p className="text-white/50 text-sm mb-6">These actions are permanent and cannot be undone.</p>
                <div className="space-y-4">
                  <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <h3 className="font-semibold text-red-400 mb-1">Deactivate Account</h3>
                    <p className="text-sm text-white/50 mb-4">
                      Temporarily hide your profile. You can reactivate at any time by logging back in.
                    </p>
                    <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm">
                      Deactivate Account
                    </button>
                  </div>
                  <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <h3 className="font-semibold text-red-400 mb-1">Delete Account</h3>
                    <p className="text-sm text-white/50 mb-4">
                      Permanently delete your account and all associated data. This cannot be undone.
                      To request deletion, email{" "}
                      <a href="mailto:support@afrimatch.app" className="text-red-400 underline">
                        support@afrimatch.app
                      </a>
                    </p>
                    <a
                      href="mailto:support@afrimatch.app?subject=Account Deletion Request"
                      className="inline-block bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
                    >
                      Request Account Deletion
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

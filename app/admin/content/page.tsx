"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";

type ContentSection = "announcements" | "featured" | "courses" | "blog";

export default function AdminContentPage() {
  const [section, setSection] = useState<ContentSection>("announcements");
  const [announcement, setAnnouncement] = useState({ title: "", message: "", type: "info", active: true });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveAnnouncement = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/content/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcement),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const sections: { key: ContentSection; label: string; icon: string }[] = [
    { key: "announcements", label: "Announcements", icon: "📢" },
    { key: "featured", label: "Featured Profiles", icon: "⭐" },
    { key: "courses", label: "Courses", icon: "📚" },
    { key: "blog", label: "Blog Posts", icon: "✍️" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Content Management</h1>
        <p className="text-slate-400 mt-1">Manage announcements, featured profiles, courses, and blog posts</p>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-8">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              section === s.key
                ? "bg-amber-500 text-black"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Announcements section */}
      {section === "announcements" && (
        <div className="max-w-2xl">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-6">Site-wide Announcement Banner</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Title</label>
                <input
                  type="text"
                  value={announcement.title}
                  onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                  placeholder="e.g. 🎉 AfriMatch is now live in 54 countries!"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Message</label>
                <textarea
                  value={announcement.message}
                  onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                  placeholder="Enter the announcement message..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Type</label>
                <select
                  value={announcement.type}
                  onChange={(e) => setAnnouncement({ ...announcement, type: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50"
                >
                  <option value="info">ℹ️ Info</option>
                  <option value="success">✅ Success</option>
                  <option value="warning">⚠️ Warning</option>
                  <option value="promo">🎉 Promotion</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-slate-400 text-sm">Active</label>
                <button
                  onClick={() => setAnnouncement({ ...announcement, active: !announcement.active })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${announcement.active ? "bg-amber-500" : "bg-white/10"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${announcement.active ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
              <button
                onClick={saveAnnouncement}
                disabled={saving}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3 rounded-xl transition disabled:opacity-50"
              >
                {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Announcement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Profiles */}
      {section === "featured" && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="text-white font-semibold mb-2">Featured Profiles</h3>
          <p className="text-slate-400 text-sm">Select verified users to feature on the homepage and community pages.</p>
          <p className="text-slate-500 text-xs mt-4">Coming soon — requires user verification system to be complete.</p>
        </div>
      )}

      {/* Courses */}
      {section === "courses" && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-white font-semibold mb-2">Course Management</h3>
          <p className="text-slate-400 text-sm">Add, edit, and manage professional development courses.</p>
          <a
            href="/admin/content/courses/new"
            className="inline-block mt-4 px-6 py-2.5 bg-amber-500 text-black font-semibold rounded-xl text-sm hover:bg-amber-400 transition"
          >
            + Add New Course
          </a>
        </div>
      )}

      {/* Blog */}
      {section === "blog" && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">✍️</div>
          <h3 className="text-white font-semibold mb-2">Blog Posts</h3>
          <p className="text-slate-400 text-sm">Publish articles, success stories, and platform updates.</p>
          <a
            href="/blog/new"
            className="inline-block mt-4 px-6 py-2.5 bg-amber-500 text-black font-semibold rounded-xl text-sm hover:bg-amber-400 transition"
          >
            + Write New Post
          </a>
        </div>
      )}
    </div>
  );
}

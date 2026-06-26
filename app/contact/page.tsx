"use client";
import { Navbar } from "@/components/navbar";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setError("Failed to send message. Please try again or email us directly.");
      }
    } catch {
      setError("Failed to send message. Please email us directly at support@afrimatch.app");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-slate-400 text-lg">We're here to help. Reach out to our team anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-3xl mb-3">📧</div>
                <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
                <p className="text-slate-400 text-sm mb-3">For general inquiries and support</p>
                <a href="mailto:contact@afrimatch.app" className="text-amber-400 hover:text-amber-300 transition text-sm">
                  contact@afrimatch.app
                </a>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="text-lg font-semibold text-white mb-2">Safety & Trust</h3>
                <p className="text-slate-400 text-sm mb-3">Report abuse or safety concerns</p>
                <a href="mailto:safety@afrimatch.app" className="text-amber-400 hover:text-amber-300 transition text-sm">
                  safety@afrimatch.app
                </a>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-3xl mb-3">💼</div>
                <h3 className="text-lg font-semibold text-white mb-2">Business & Partnerships</h3>
                <p className="text-slate-400 text-sm mb-3">For business inquiries</p>
                <a href="mailto:business@afrimatch.app" className="text-amber-400 hover:text-amber-300 transition text-sm">
                  business@afrimatch.app
                </a>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-3xl mb-3">🌍</div>
                <h3 className="text-lg font-semibold text-white mb-2">Headquarters</h3>
                <p className="text-slate-400 text-sm">
                  ZuriTech Global<br />
                  BP: 12822<br />
                  Niamey, Niger Republic
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>

                {success ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-slate-400">We'll get back to you within 24 hours.</p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="mt-6 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Your Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          required
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@example.com"
                          required
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:outline-none transition"
                      >
                        <option value="">Select a subject...</option>
                        <option value="account">Account Issues</option>
                        <option value="billing">Billing & Subscription</option>
                        <option value="safety">Safety & Reporting</option>
                        <option value="technical">Technical Support</option>
                        <option value="feedback">Feedback & Suggestions</option>
                        <option value="partnership">Business & Partnerships</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us how we can help..."
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none transition resize-none"
                      />
                    </div>
                    {error && (
                      <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: "Is AfriMatch free to use?",
                  a: "Yes! Signing up and creating your profile is completely free. Premium features like unlimited messaging, advanced discovery filters, and priority visibility are available with a subscription.",
                },
                {
                  q: "How does the recommendation system work?",
                  a: "Our AI analyzes your profile, interests, professional goals, and community activity to suggest relevant people, mentors, and opportunities.",
                },
                {
                  q: "Is my data safe?",
                  a: "Absolutely. We use industry-standard encryption and never sell your personal data. See our Privacy Policy for full details.",
                },
                {
                  q: "Can I use both Community and Professional modes?",
                  a: "Yes! Our combined subscription gives you full access to both Community and Professional networking features at a discounted price.",
                },
                {
                  q: "How do I cancel my subscription?",
                  a: "You can cancel anytime from your account settings. Your premium access continues until the end of your billing period.",
                },
                {
                  q: "How do I report a user?",
                  a: "Use the report button on any profile or message. Our safety team reviews all reports within 24 hours.",
                },
              ].map((faq, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                  <p className="text-slate-400 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-slate-400 text-sm">
          <p>© 2026 <strong>ZuriTech Global</strong>. All rights reserved.</p>
          <div className="flex gap-6 justify-center mt-3">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

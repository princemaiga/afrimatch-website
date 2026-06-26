"use client";
import { Navbar } from "@/components/navbar";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-slate-400">Last updated: January 1, 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <div className="text-slate-300 space-y-4">
                <p>AfriMatch collects information you provide directly to us, such as when you create an account, complete your profile, or contact us for support.</p>
                <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Name, email address, and password</li>
                  <li>Date of birth, gender, and location</li>
                  <li>Profile photos and bio</li>
                  <li>Community interests and professional goals</li>
                  <li>Professional information (for Professional mode)</li>
                </ul>
                <h3 className="text-lg font-semibold text-white">Usage Information</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Log data including IP address, browser type, and pages visited</li>
                  <li>Device information and identifiers</li>
                  <li>Activity on the platform (connections, messages, interactions)</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <div className="text-slate-300 space-y-3">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Connect you with relevant community members and professional opportunities</li>
                  <li>Send you notifications about connections, messages, and platform updates</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Ensure safety and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
              <div className="text-slate-300 space-y-4">
                <p>We do not sell your personal information. We may share your information with:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li><strong className="text-white">Other Users:</strong> Your profile information is visible to other AfriMatch users based on your privacy settings</li>
                  <li><strong className="text-white">Service Providers:</strong> Third-party vendors who assist us in operating our platform (payment processors, cloud storage, analytics)</li>
                  <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect the rights and safety of our users</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
              <p className="text-slate-300">We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
              <div className="text-slate-300 space-y-3">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data (data portability)</li>
                  <li>Lodge a complaint with your local data protection authority</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">6. Cookies</h2>
              <p className="text-slate-300">We use cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser preferences.</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
              <p className="text-slate-300">If you have questions about this Privacy Policy, please contact us at:</p>
              <div className="mt-4 space-y-2 text-slate-400">
                <p>Email: <a href="mailto:privacy@afrimatch.app" className="text-amber-400 hover:text-amber-300">privacy@afrimatch.app</a></p>
                <p>Address: AfriMatch Ltd, Pan-African Digital Hub, Niamey, Niger Republic</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="text-amber-400 hover:text-amber-300 transition">← Back to Home</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-slate-400 text-sm">
          <p>© 2026 ZuriTech Global. All rights reserved.</p>
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

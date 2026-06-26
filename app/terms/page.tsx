"use client";
import { Navbar } from "@/components/navbar";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-slate-400">Last updated: January 1, 2026</p>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-300">By accessing or using AfriMatch, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. These terms apply to all users of AfriMatch, including Community Mode, Professional Mode, and Dual Mode users.</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility</h2>
              <div className="text-slate-300 space-y-3">
                <p>To use AfriMatch, you must:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Be at least 18 years of age</li>
                  <li>Have the legal capacity to enter into a binding agreement</li>
                  <li>Not be prohibited from using our services under applicable law</li>
                  <li>Provide accurate and truthful information when creating your account</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">3. Account Registration</h2>
              <div className="text-slate-300 space-y-3">
                <p>When you create an account, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the security of your password</li>
                  <li>Not share your account with others</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Be responsible for all activities that occur under your account</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">4. Prohibited Conduct</h2>
              <div className="text-slate-300 space-y-3">
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Create fake profiles or impersonate others</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Send spam, unsolicited messages, or commercial solicitations</li>
                  <li>Share explicit, offensive, or illegal content</li>
                  <li>Attempt to extract personal information from other users</li>
                  <li>Use the platform for any fraudulent or illegal purpose</li>
                  <li>Circumvent any security measures or access controls</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">5. Subscription & Payments</h2>
              <div className="text-slate-300 space-y-3">
                <p>AfriMatch offers free and premium subscription tiers:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li><strong className="text-white">Free Tier:</strong> Basic access to browse profiles and limited messaging</li>
                  <li><strong className="text-white">Professional Premium:</strong> Unlimited applications, advanced filters, and priority visibility from $5/month</li>
                  <li><strong className="text-white">Professional Premium:</strong> Full access to job listings, mentorship, and networking from $19.99/month</li>
                  <li><strong className="text-white">Dual Mode:</strong> All features from both modes from $12.99/month</li>
                </ul>
                <p className="mt-4">Subscriptions auto-renew unless cancelled. Refunds are available within 7 days of purchase if you have not used premium features.</p>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">6. Content & Intellectual Property</h2>
              <p className="text-slate-300">You retain ownership of content you post on AfriMatch. By posting content, you grant us a non-exclusive, worldwide license to use, display, and distribute your content on our platform. You are responsible for ensuring you have the rights to any content you post.</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">7. Termination</h2>
              <p className="text-slate-300">We reserve the right to suspend or terminate your account at any time for violations of these terms. You may delete your account at any time through your account settings. Upon termination, your data will be handled in accordance with our Privacy Policy.</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
              <p className="text-slate-300">AfriMatch is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">9. Governing Law</h2>
              <p className="text-slate-300">These Terms are governed by the laws of Nigeria. Any disputes shall be resolved through binding arbitration in Niamey, Niger Republic, except where prohibited by local law.</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">10. Contact</h2>
              <p className="text-slate-300">For questions about these Terms, contact us at:</p>
              <div className="mt-4 space-y-2 text-slate-400">
                <p>Email: <a href="mailto:legal@afrimatch.app" className="text-amber-400 hover:text-amber-300">legal@afrimatch.app</a></p>
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

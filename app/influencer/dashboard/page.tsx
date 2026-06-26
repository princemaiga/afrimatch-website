"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Share2, TrendingUp, Users, DollarSign, Link as LinkIcon } from 'lucide-react';

interface InfluencerStats {
  influencerId: string;
  name: string;
  referralCode: string;
  referralLink: string;
  totalClicks: number;
  totalSignups: number;
  conversionRate: number;
  totalEarnings: number;
  pendingEarnings: number;
  tier: string;
  commissionRate: number;
}

interface ReferralData {
  date: string;
  clicks: number;
  signups: number;
  earnings: number;
}

export default function InfluencerDashboard() {
  const [stats, setStats] = useState<InfluencerStats>({
    influencerId: 'inf_001',
    name: 'Amara Okonkwo',
    referralCode: 'AMARA123',
    referralLink: 'https://afrimatch.app/ref/AMARA123',
    totalClicks: 1250,
    totalSignups: 85,
    conversionRate: 6.8,
    totalEarnings: 1275,
    pendingEarnings: 425,
    tier: 'Micro',
    commissionRate: 20,
  });

  const [referralData, setReferralData] = useState<ReferralData[]>([
    { date: 'Jun 1', clicks: 45, signups: 3, earnings: 45 },
    { date: 'Jun 2', clicks: 52, signups: 4, earnings: 60 },
    { date: 'Jun 3', clicks: 48, signups: 3, earnings: 45 },
    { date: 'Jun 4', clicks: 65, signups: 5, earnings: 75 },
    { date: 'Jun 5', clicks: 72, signups: 6, earnings: 90 },
    { date: 'Jun 6', clicks: 58, signups: 4, earnings: 60 },
    { date: 'Jun 7', clicks: 135, signups: 10, earnings: 150 },
  ]);

  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform: string) => {
    const message = `Join me on AfriMatch! Use code ${stats.referralCode} to get exclusive rewards. Download now: ${stats.referralLink}`;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(stats.referralLink)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(stats.referralLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
    };
    window.open(urls[platform], '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Influencer Dashboard</h1>
          <p className="text-slate-600">Track your referrals, earnings, and performance metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-slate-900">{stats.totalClicks.toLocaleString()}</div>
                <LinkIcon className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
              <p className="text-xs text-slate-500 mt-2">Referral link clicks</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-slate-900">{stats.totalSignups}</div>
                <Users className="w-8 h-8 text-green-500 opacity-20" />
              </div>
              <p className="text-xs text-slate-500 mt-2">Successful referrals</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-slate-900">{stats.conversionRate.toFixed(1)}%</div>
                <TrendingUp className="w-8 h-8 text-purple-500 opacity-20" />
              </div>
              <p className="text-xs text-slate-500 mt-2">Clicks to signups</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-slate-900">${stats.totalEarnings.toLocaleString()}</div>
                <DollarSign className="w-8 h-8 text-amber-500 opacity-20" />
              </div>
              <p className="text-xs text-slate-500 mt-2">{stats.commissionRate}% commission rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Section */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>Share this link to earn commissions on referrals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={stats.referralLink}
                  readOnly
                  className="bg-slate-50 border-slate-200"
                />
                <Button
                  onClick={() => copyToClipboard(stats.referralLink)}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  onClick={() => shareOnSocial('twitter')}
                  variant="outline"
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  onClick={() => shareOnSocial('facebook')}
                  variant="outline"
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button
                  onClick={() => shareOnSocial('linkedin')}
                  variant="outline"
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  onClick={() => shareOnSocial('whatsapp')}
                  variant="outline"
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Referral Code:</strong> {stats.referralCode}
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Share your code for users to get exclusive rewards when they sign up
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>Last 7 days of referral activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">Clicks</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">Signups</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {referralData.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-900">{row.date}</td>
                      <td className="py-3 px-4 text-right text-slate-600">{row.clicks}</td>
                      <td className="py-3 px-4 text-right text-slate-600">{row.signups}</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">${row.earnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Pending Earnings</CardTitle>
              <CardDescription>Available for withdrawal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 mb-4">
                ${stats.pendingEarnings.toLocaleString()}
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Request Withdrawal
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Your Tier</CardTitle>
              <CardDescription>Current influencer tier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-3xl font-bold text-slate-900 mb-2">{stats.tier}</div>
                <div className="text-sm text-slate-600">
                  <p>Commission Rate: <strong>{stats.commissionRate}%</strong></p>
                  <p className="mt-2">Followers: <strong>35,000+</strong></p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Tier Benefits
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

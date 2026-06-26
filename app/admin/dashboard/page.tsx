"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  totalRevenue: number;
  churnRate: number;
  ltv: number;
  pendingVerifications: number;
  reportedProfiles: number;
}

interface RecentActivity {
  id: string;
  type: "signup" | "subscription" | "payment" | "report";
  user: string;
  description: string;
  timestamp: Date;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<"users" | "revenue" | "subscriptions">("users");

  useEffect(() => {
    // Check if user is admin
    if (session && !session.user?.email?.includes("admin")) {
      router.push("/dashboard");
    }

    fetchDashboardData();
  }, [session, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      const data = await response.json();
      setStats(data.stats);
      setRecentActivity(data.recentActivity);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Monitor platform metrics and user activity</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Users Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-blue-200 text-xs mt-2">{stats.activeUsers} active today</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Monthly Revenue</p>
                <p className="text-3xl font-bold text-white">${stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-green-200 text-xs mt-2">Total: ${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          {/* Subscriptions Card */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Active Subscriptions</p>
                <p className="text-3xl font-bold text-white">{stats.activeSubscriptions.toLocaleString()}</p>
                <p className="text-purple-200 text-xs mt-2">Total: {stats.totalSubscriptions.toLocaleString()}</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>

          {/* LTV Card */}
          <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Customer LTV</p>
                <p className="text-3xl font-bold text-white">${stats.ltv.toLocaleString()}</p>
                <p className="text-amber-200 text-xs mt-2">Churn: {stats.churnRate.toFixed(1)}%</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pending Verifications */}
          <div className="bg-slate-800 rounded-lg p-6 border border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Pending Verifications</h3>
                <p className="text-slate-400 text-sm">{stats.pendingVerifications} profiles waiting</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
            <button className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg transition-all">
              Review Profiles
            </button>
          </div>

          {/* Reported Profiles */}
          <div className="bg-slate-800 rounded-lg p-6 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Reported Profiles</h3>
                <p className="text-slate-400 text-sm">{stats.reportedProfiles} reports pending</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
            <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-all">
              Review Reports
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-slate-400">No recent activity</p>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {activity.type === "signup" && "📝"}
                      {activity.type === "subscription" && "🎯"}
                      {activity.type === "payment" && "💳"}
                      {activity.type === "report" && "⚠️"}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{activity.user}</p>
                      <p className="text-slate-400 text-sm">{activity.description}</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users Management */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Users Management</h3>
            <div className="space-y-3">
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-all">
                View All Users
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-all">
                Ban/Suspend User
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-all">
                Export User Data
              </button>
            </div>
          </div>

          {/* Subscriptions Management */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Subscriptions</h3>
            <div className="space-y-3">
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-all">
                Manage Plans
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-all">
                View Payments
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-all">
                Refund Management
              </button>
            </div>
          </div>

          {/* Content Moderation */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Moderation</h3>
            <div className="space-y-3">
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-all">
                Review Reports
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-all">
                Verify Profiles
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-all">
                Content Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

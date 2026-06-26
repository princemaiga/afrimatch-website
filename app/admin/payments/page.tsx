"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  provider: "stripe" | "flutterwave";
  plan: string;
  status: "succeeded" | "pending" | "failed" | "refunded";
  createdAt: string;
}

interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  stripeRevenue: number;
  flutterwaveRevenue: number;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "succeeded" | "pending" | "failed" | "refunded">("all");

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ ...(filter !== "all" && { status: filter }) });
      const res = await fetch(`/api/admin/payments?${params}`);
      const data = await res.json();
      setPayments(data.payments || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string) => {
    if (status === "succeeded") return "text-green-400 bg-green-400/10";
    if (status === "pending") return "text-yellow-400 bg-yellow-400/10";
    if (status === "failed") return "text-red-400 bg-red-400/10";
    if (status === "refunded") return "text-blue-400 bg-blue-400/10";
    return "text-slate-400 bg-slate-400/10";
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" }).format(amount / 100);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Payments & Revenue</h1>
        <p className="text-slate-400 mt-1">Track all transactions, subscriptions, and revenue</p>
      </div>

      {/* Revenue Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6">
            <div className="text-slate-400 text-sm mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-white">${(stats.totalRevenue / 100).toLocaleString()}</div>
            <div className="text-amber-400 text-xs mt-2">All time</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-slate-400 text-sm mb-1">Monthly Revenue</div>
            <div className="text-3xl font-bold text-white">${(stats.monthlyRevenue / 100).toLocaleString()}</div>
            <div className="text-slate-500 text-xs mt-2">This month</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-slate-400 text-sm mb-1">Active Subscriptions</div>
            <div className="text-3xl font-bold text-white">{stats.activeSubscriptions}</div>
            <div className="text-slate-500 text-xs mt-2">Churn: {stats.churnRate?.toFixed(1)}%</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-slate-400 text-sm mb-1">Stripe Revenue</div>
            <div className="text-2xl font-bold text-purple-400">${(stats.stripeRevenue / 100).toLocaleString()}</div>
            <div className="text-slate-500 text-xs mt-2">Cards & wallets</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-slate-400 text-sm mb-1">Flutterwave Revenue</div>
            <div className="text-2xl font-bold text-green-400">${(stats.flutterwaveRevenue / 100).toLocaleString()}</div>
            <div className="text-slate-500 text-xs mt-2">Mobile money & Africa</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-slate-400 text-sm mb-1">Avg Revenue / User</div>
            <div className="text-2xl font-bold text-blue-400">
              ${stats.activeSubscriptions > 0 ? ((stats.monthlyRevenue / 100) / stats.activeSubscriptions).toFixed(2) : "0.00"}
            </div>
            <div className="text-slate-500 text-xs mt-2">ARPU this month</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["all", "succeeded", "pending", "failed", "refunded"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
              filter === f
                ? "bg-amber-500 text-black"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">User</th>
              <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Amount</th>
              <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Plan</th>
              <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Provider</th>
              <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  Loading payments...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-white/3 transition">
                  <td className="px-6 py-4">
                    <div className="text-white text-sm font-medium">{payment.userName}</div>
                    <div className="text-slate-500 text-xs">{payment.userEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-white font-semibold text-sm">
                    {formatCurrency(payment.amount, payment.currency)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 capitalize">
                      {payment.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      payment.provider === "stripe" ? "bg-purple-500/10 text-purple-400" : "bg-green-500/10 text-green-400"
                    }`}>
                      {payment.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{payment.createdAt}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

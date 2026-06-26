"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  mode: string;
  createdAt: string;
  subscription: string | null;
  verified: boolean;
  status: "active" | "suspended" | "banned";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "suspended" | "banned">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PER_PAGE = 20;

  useEffect(() => {
    fetchUsers();
  }, [page, filter, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: PER_PAGE.toString(),
        ...(filter !== "all" && { status: filter }),
        ...(search && { search }),
      });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const statusColor = (status: string) => {
    if (status === "active") return "text-green-400 bg-green-400/10";
    if (status === "suspended") return "text-yellow-400 bg-yellow-400/10";
    if (status === "banned") return "text-red-400 bg-red-400/10";
    return "text-slate-400 bg-slate-400/10";
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-slate-400 mt-1">View, search, and manage all registered users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/50"
        />
        <div className="flex gap-2">
          {(["all", "active", "suspended", "banned"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
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
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users", value: total, color: "text-white" },
          { label: "Active", value: users.filter(u => u.status === "active").length, color: "text-green-400" },
          { label: "Suspended", value: users.filter(u => u.status === "suspended").length, color: "text-yellow-400" },
          { label: "Banned", value: users.filter(u => u.status === "banned").length, color: "text-red-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">User</th>
              <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Country</th>
              <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Mode</th>
              <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Plan</th>
              <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Joined</th>
              <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-white/3 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-xs font-bold">
                        {user.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{user.name || "—"}</div>
                        <div className="text-slate-500 text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{user.country || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      user.mode === "professional" ? "bg-blue-500/10 text-blue-400" : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {user.mode || "community"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.subscription ? "bg-purple-500/10 text-purple-400" : "bg-white/5 text-slate-500"
                    }`}>
                      {user.subscription || "Free"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{user.createdAt}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {user.status === "active" && (
                        <button
                          onClick={() => updateUserStatus(user.id, "suspended")}
                          className="text-xs text-yellow-400 hover:text-yellow-300 bg-yellow-400/10 hover:bg-yellow-400/20 px-2 py-1 rounded-lg transition"
                        >
                          Suspend
                        </button>
                      )}
                      {user.status === "suspended" && (
                        <>
                          <button
                            onClick={() => updateUserStatus(user.id, "active")}
                            className="text-xs text-green-400 hover:text-green-300 bg-green-400/10 hover:bg-green-400/20 px-2 py-1 rounded-lg transition"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => updateUserStatus(user.id, "banned")}
                            className="text-xs text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-2 py-1 rounded-lg transition"
                          >
                            Ban
                          </button>
                        </>
                      )}
                      {user.status === "banned" && (
                        <button
                          onClick={() => updateUserStatus(user.id, "active")}
                          className="text-xs text-green-400 hover:text-green-300 bg-green-400/10 hover:bg-green-400/20 px-2 py-1 rounded-lg transition"
                        >
                          Unban
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {total > PER_PAGE && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <div className="text-slate-400 text-sm">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 bg-white/5 text-slate-400 rounded-lg text-sm disabled:opacity-40 hover:bg-white/10 transition"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page * PER_PAGE >= total}
                className="px-3 py-1.5 bg-white/5 text-slate-400 rounded-lg text-sm disabled:opacity-40 hover:bg-white/10 transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

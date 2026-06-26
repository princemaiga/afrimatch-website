"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";

interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reportedUserName: string;
  category: string;
  description: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  severity: "low" | "medium" | "high" | "critical";
  createdAt: string;
  evidence: string[];
}

const SAMPLE_REPORTS: Report[] = [
  {
    id: "report-1",
    reporterId: "user-123",
    reportedUserId: "user-456",
    reportedUserName: "John Doe",
    category: "Inappropriate Content",
    description: "User posted explicit images in profile",
    status: "investigating",
    severity: "high",
    createdAt: "2 hours ago",
    evidence: ["image-1", "image-2"],
  },
  {
    id: "report-2",
    reporterId: "user-789",
    reportedUserId: "user-101",
    reportedUserName: "Jane Smith",
    category: "Harassment",
    description: "User sent multiple harassing messages",
    status: "pending",
    severity: "critical",
    createdAt: "30 minutes ago",
    evidence: ["message-1", "message-2", "message-3"],
  },
  {
    id: "report-3",
    reporterId: "user-202",
    reportedUserId: "user-303",
    reportedUserName: "Scammer Account",
    category: "Scam/Fraud",
    description: "User asking for money upfront",
    status: "resolved",
    severity: "critical",
    createdAt: "1 day ago",
    evidence: ["message-1"],
  },
];

export default function ModerationPage() {
  const [reports, setReports] = useState<Report[]>(SAMPLE_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [actionReason, setActionReason] = useState("");
  const [selectedAction, setSelectedAction] = useState<"warn" | "suspend" | "ban" | "dismiss">("warn");

  const filteredReports = reports.filter((report) => {
    const statusMatch = filterStatus === "all" || report.status === filterStatus;
    const severityMatch = filterSeverity === "all" || report.severity === filterSeverity;
    return statusMatch && severityMatch;
  });

  const handleUpdateReportStatus = (reportId: string, newStatus: string) => {
    setReports(
      reports.map((r) =>
        r.id === reportId ? { ...r, status: newStatus as any } : r
      )
    );
  };

  const handleTakeAction = () => {
    if (!selectedReport || !actionReason) return;

    // Log action
    console.log(`Action: ${selectedAction} on user ${selectedReport.reportedUserId}`);
    console.log(`Reason: ${actionReason}`);

    // Update report status
    handleUpdateReportStatus(selectedReport.id, "resolved");

    // Reset form
    setActionReason("");
    setSelectedAction("warn");
    setSelectedReport(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600";
      case "high":
        return "bg-orange-600";
      case "medium":
        return "bg-yellow-600";
      case "low":
        return "bg-blue-600";
      default:
        return "bg-slate-600";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-600/20 text-red-400";
      case "investigating":
        return "bg-yellow-600/20 text-yellow-400";
      case "resolved":
        return "bg-green-600/20 text-green-400";
      case "dismissed":
        return "bg-slate-600/20 text-slate-400";
      default:
        return "bg-slate-600/20 text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Moderation Dashboard</h1>
          <p className="text-red-100">Review and manage user reports</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-slate-800 border-b border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Total Reports</p>
              <p className="text-white text-2xl font-bold">{reports.length}</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Pending</p>
              <p className="text-red-400 text-2xl font-bold">
                {reports.filter((r) => r.status === "pending").length}
              </p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Investigating</p>
              <p className="text-yellow-400 text-2xl font-bold">
                {reports.filter((r) => r.status === "investigating").length}
              </p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Resolved</p>
              <p className="text-green-400 text-2xl font-bold">
                {reports.filter((r) => r.status === "resolved").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reports List */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg overflow-hidden">
              {/* Filters */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex gap-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>

                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                  >
                    <option value="all">All Severity</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Reports */}
              <div className="divide-y divide-slate-700">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-6 cursor-pointer hover:bg-slate-750 transition-all ${
                      selectedReport?.id === report.id ? "bg-slate-700" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {report.reportedUserName}
                        </h3>
                        <p className="text-slate-400 text-sm">{report.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(report.severity)}`}>
                          {report.severity.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(report.status)}`}>
                          {report.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm mb-2">{report.description}</p>
                    <p className="text-slate-500 text-xs">Reported {report.createdAt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report Details & Actions */}
          <div className="lg:col-span-1">
            {selectedReport ? (
              <div className="bg-slate-800 rounded-lg p-6 sticky top-4">
                <h3 className="text-xl font-bold text-white mb-4">Report Details</h3>

                {/* Report Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-slate-400 text-sm">Reported User</p>
                    <p className="text-white font-semibold">{selectedReport.reportedUserName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Category</p>
                    <p className="text-white font-semibold">{selectedReport.category}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Severity</p>
                    <p className={`font-semibold ${getSeverityColor(selectedReport.severity)} inline-block px-2 py-1 rounded`}>
                      {selectedReport.severity.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Status</p>
                    <select
                      value={selectedReport.status}
                      onChange={(e) =>
                        handleUpdateReportStatus(selectedReport.id, e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved">Resolved</option>
                      <option value="dismissed">Dismissed</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-slate-700 pt-6">
                  <h4 className="text-lg font-bold text-white mb-4">Take Action</h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Action
                      </label>
                      <select
                        value={selectedAction}
                        onChange={(e) => setSelectedAction(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                      >
                        <option value="warn">Send Warning</option>
                        <option value="suspend">Suspend Account</option>
                        <option value="ban">Ban Account</option>
                        <option value="dismiss">Dismiss Report</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Reason
                      </label>
                      <textarea
                        value={actionReason}
                        onChange={(e) => setActionReason(e.target.value)}
                        placeholder="Explain your action..."
                        className="w-full px-3 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none resize-none"
                        rows={4}
                      />
                    </div>

                    <button
                      onClick={handleTakeAction}
                      disabled={!actionReason}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg font-bold transition-all"
                    >
                      Confirm Action
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg p-6 text-center">
                <p className="text-slate-400">Select a report to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

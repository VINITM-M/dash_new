import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  RefreshCw,
  ChevronRight,
  MoreVertical,
  FileText,
  Settings,
  LogOut
} from "lucide-react";

const TechTransferDashboard = () => {
  const [selectedDate, setSelectedDate] = useState("2025-11-25");
  const location = useLocation();

  const streams = [
    {
      name: "PR&D Stream",
      completed: 2,
      total: 9,
      draft: 1,
      review: 7,
      percentage: (2 / 9) * 100,
    },
    {
      name: "AR&D Stream",
      completed: 1,
      total: 10,
      draft: 4,
      review: 1,
      percentage: (1 / 10) * 100,
    },
    {
      name: "PE Stream",
      completed: 0,
      total: 2,
      draft: 2,
      review: 0,
      percentage: 0,
    },
  ];

  const statusData = [
    {
      stream: "PR&D",
      totalRequired: 9,
      yetToInitiate: 1,
      draft: 1,
      review: 7,
      approved: 2,
    },
    {
      stream: "AR&D",
      totalRequired: 10,
      yetToInitiate: 4,
      draft: 4,
      review: 1,
      approved: 1,
    },
    {
      stream: "PE",
      totalRequired: 2,
      yetToInitiate: 0,
      draft: 2,
      review: 0,
      approved: 0,
    },
  ];

  const navLinkClass = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
      location.pathname === path
        ? "text-blue-600 bg-blue-50 font-medium"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
              TT
            </div>
            <span className="font-semibold text-lg">TechTransfer</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <Link to="/overview" className={navLinkClass("/overview")}>
            <div className="w-5 h-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <span>Overview</span>
          </Link>

          <Link to="/document-tracker" className={navLinkClass("/document-tracker")}>
            <FileText className="w-5 h-5" />
            <span className="font-medium">Document Tracker</span>
          </Link>

          <Link to="/settings" className={navLinkClass("/settings")}>
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg w-full">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Document Progress Tracker</h1>
              <p className="text-gray-600">Overview across PR&D, AR&D, and PE Streams</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white">
                <Calendar className="w-4 h-4 text-gray-600" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border-none outline-none text-sm"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                JS
              </div>
            </div>
          </div>

          {/* Stream Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {streams.map((stream, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{stream.name}</h3>
                    <p className="text-sm text-gray-600">Progress Tracker</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <div className="mb-4">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">{stream.completed}</span>
                    <span className="text-gray-600 mb-1">/ {stream.total} Completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${index === 0 ? "bg-blue-600" : index === 1 ? "bg-purple-600" : "bg-gray-400"}`}
                      style={{ width: `${stream.percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-4 text-sm">
                  <span className="text-orange-600">{stream.draft} Draft</span>
                  <span className="text-blue-600">{stream.review} Review</span>
                </div>
              </div>
            ))}
          </div>

          {/* Status Breakdown Table */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Status Breakdown</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Download Report</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stream</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Required</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Yet to Initiate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-orange-600">Draft</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">Review</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-green-600">Approved</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {statusData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.stream}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{row.totalRequired}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{row.yetToInitiate}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-orange-600">{row.draft}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600">{row.review}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">{row.approved}</td>
                      <td className="px-6 py-4">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechTransferDashboard;

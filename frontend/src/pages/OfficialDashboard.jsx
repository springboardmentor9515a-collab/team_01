import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  AlertCircle,
  Calendar,
  Building2,
} from "lucide-react";

const OfficialDashboard = () => {
  const [officialName, setOfficialName] = useState("Official");
  const navigate = useNavigate();

  // Load official's name from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setOfficialName(parsedUser.name || "Official");
      } catch (err) {
        console.error("Error parsing user:", err);
      }
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Petition and metrics — all set to 0
  const pendingPetitions = [];

  const recentActions = []; // no recent actions yet

  const departmentMetrics = [
    { name: "Public Works", pending: 0, approved: 0, avgTime: "0 days" },
    { name: "Education", pending: 0, approved: 0, avgTime: "0 days" },
    { name: "Public Safety", pending: 0, approved: 0, avgTime: "0 days" },
    { name: "Transportation", pending: 0, approved: 0, avgTime: "0 days" },
  ];

  return (
    <Layout userType="official">
      <div className="p-8 max-w-7xl mx-auto bg-gradient-to-br from-[#E8F0FF] via-[#F4F8FF] to-[#DCE6F9] min-h-screen">
        {/* Header with Logout */}
        <div className="mb-10 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-[#1A237E] tracking-tight mb-2">
              Welcome back, {officialName} 👋
            </h1>
            <p className="text-gray-600 text-base">
              Manage petitions, review community requests, and track civic engagement efficiently.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Pending Review"
            value="0"
            subtitle="petitions awaiting review"
            icon={Clock}
            iconColor="bg-yellow-100 text-yellow-700"
            trend={{ value: "0 new", isPositive: false }}
          />
          <StatCard
            title="Approved This Month"
            value="0"
            subtitle="petitions approved"
            icon={CheckCircle2}
            iconColor="bg-green-100 text-green-600"
            trend={{ value: "0%", isPositive: true }}
          />
          <StatCard
            title="Active Citizens"
            value="0"
            subtitle="engaged community members"
            icon={Users}
            iconColor="bg-blue-100 text-blue-700"
            trend={{ value: "0%", isPositive: true }}
          />
          <StatCard
            title="Avg Response Time"
            value="0"
            subtitle="days to review"
            icon={TrendingUp}
            iconColor="bg-indigo-100 text-indigo-700"
            trend={{ value: "0 days", isPositive: true }}
          />
        </div>

        {/* Priority Alerts */}
        <div className="stat-card mb-10 bg-gradient-to-r from-[#FFF4E5] to-[#FFE6CC] border border-yellow-300 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 text-[#E65100]">
                No Priority Items
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                There are currently no petitions requiring urgent attention.
              </p>
              <Button
                size="sm"
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 cursor-not-allowed"
                disabled
              >
                Review Priority Items
              </Button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Pending Petitions */}
          <div className="lg:col-span-2">
            <div className="stat-card mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-[#1A237E]">
                  <FileText className="w-6 h-6" />
                  Petitions Awaiting Review
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white"
                >
                  View All
                </Button>
              </div>
              {pendingPetitions.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p className="text-sm">✅ No petitions available for review right now.</p>
                </div>
              ) : (
                <p>Petition List...</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Actions */}
            <div className="stat-card">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[#1A237E]">
                <Calendar className="w-5 h-5" />
                Recent Actions
              </h3>
              {recentActions.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">
                  No recent actions yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {/* dynamic actions */}
                </div>
              )}
            </div>

            {/* Department Metrics */}
            <div className="stat-card">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[#1A237E]">
                <Building2 className="w-5 h-5" />
                Department Overview
              </h3>
              <div className="space-y-4">
                {departmentMetrics.map((dept, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-[#E8EAF6] hover:bg-[#C5CAE9] transition"
                  >
                    <div className="font-semibold text-sm mb-2">{dept.name}</div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <div className="text-gray-600">Pending</div>
                        <div className="font-bold text-yellow-700">{dept.pending}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Approved</div>
                        <div className="font-bold text-green-700">{dept.approved}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Avg Time</div>
                        <div className="font-bold">{dept.avgTime}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="stat-card bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB]">
              <h3 className="font-bold text-lg mb-4 text-[#1A237E]">Community Engagement</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Petitions</span>
                  <span className="font-bold text-lg text-[#1A237E]">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Polls</span>
                  <span className="font-bold text-lg text-[#1A237E]">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Participation Rate</span>
                  <span className="font-bold text-lg text-green-700">0%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Satisfaction Score</span>
                  <span className="font-bold text-lg text-blue-700">0 / 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OfficialDashboard;

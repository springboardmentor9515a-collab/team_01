import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HeartHandshake,
  CheckCircle2,
  Clock,
  Users,
  AlertCircle,
  Calendar,
  ThumbsUp,
  Target,
  QrCode,
} from "lucide-react";

const VolunteerDashboard = () => {
  const [volunteerName, setVolunteerName] = useState("Volunteer");
  const [volunteerCode, setVolunteerCode] = useState("VOL00000");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setVolunteerName(parsedUser.name || "Volunteer");
        setVolunteerCode(parsedUser.code || "VOL00000");
      } catch (err) {
        console.error("Error parsing user:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const activeProjects = []; // set to empty

  const recentActivities = []; // set to empty

  const performanceStats = [
    { name: "Hours Contributed", value: "0", trend: "0%" },
    { name: "Projects Completed", value: "0", trend: "0" },
    { name: "Impact Score", value: "0%", trend: "0%" },
    { name: "Active Teams", value: "0", trend: "0%" },
  ];

  return (
    <Layout userType="volunteer">
      <div className="p-8 max-w-7xl mx-auto bg-gradient-to-br from-[#E6F7FF] via-[#F0FBFF] to-[#D0ECF8] min-h-screen">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-[#004D40] tracking-tight mb-2">
              Welcome, {volunteerName} 💪
            </h1>
            <p className="text-gray-600 text-base">
              Track your volunteering impact and manage community projects efficiently.
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
            title="Total Hours"
            value="0"
            subtitle="volunteered this month"
            icon={Clock}
            iconColor="bg-yellow-100 text-yellow-700"
            trend={{ value: "0%", isPositive: true }}
          />
          <StatCard
            title="Projects Joined"
            value="0"
            subtitle="active volunteering projects"
            icon={HeartHandshake}
            iconColor="bg-pink-100 text-pink-700"
            trend={{ value: "0", isPositive: true }}
          />
          <StatCard
            title="Impact Score"
            value="0%"
            subtitle="based on feedback"
            icon={ThumbsUp}
            iconColor="bg-green-100 text-green-700"
            trend={{ value: "0%", isPositive: true }}
          />
          <StatCard
            title="Active Teams"
            value="0"
            subtitle="community groups"
            icon={Users}
            iconColor="bg-blue-100 text-blue-700"
            trend={{ value: "0", isPositive: true }}
          />
        </div>

        {/* Volunteer Code Card */}
        <div className="mb-10">
          <div className="stat-card p-6 flex items-center justify-between bg-gradient-to-r from-[#E0F7FA] to-[#B2EBF2] border border-teal-300 shadow-md rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-100 rounded-lg">
                <QrCode className="w-6 h-6 text-teal-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#004D40]">
                  Your Volunteer Code
                </h3>
                <p className="text-sm text-gray-600 mt-1">{volunteerCode}</p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-[#004D40] hover:bg-[#00796B] text-white"
            >
              Copy Code
            </Button>
          </div>
        </div>

        {/* Alerts */}
        <div className="stat-card mb-10 bg-gradient-to-r from-[#FFF4E5] to-[#FFE6CC] border border-yellow-300 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 text-[#E65100]">
                No Upcoming Events
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                There are currently no scheduled volunteer events. Stay tuned for updates!
              </p>
              <Button
                size="sm"
                className="bg-[#E65100] hover:bg-[#BF360C] text-white"
              >
                View Opportunities
              </Button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <div className="stat-card mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-[#004D40]">
                  <Target className="w-6 h-6" />
                  Active Volunteering Projects
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#004D40] text-[#004D40] hover:bg-[#004D40] hover:text-white"
                >
                  View All
                </Button>
              </div>
              {activeProjects.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p className="text-sm">
                    🌱 No active projects right now. Explore new opportunities!
                  </p>
                </div>
              ) : (
                <div>Projects list...</div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <div className="stat-card">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[#004D40]">
                <Calendar className="w-5 h-5" />
                Recent Activities
              </h3>
              {recentActivities.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No recent activities yet.
                </div>
              ) : (
                <div>Activities list...</div>
              )}
            </div>

            {/* Performance Stats */}
            <div className="stat-card bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]">
              <h3 className="font-bold text-lg mb-4 text-[#004D40]">
                Your Performance
              </h3>
              <div className="space-y-4">
                {performanceStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm border-b border-gray-200 pb-2 last:border-0"
                  >
                    <span className="text-gray-600">{stat.name}</span>
                    <span className="font-bold text-[#004D40]">
                      {stat.value}{" "}
                      <span className="text-xs text-green-600 ml-1">
                        {stat.trend}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VolunteerDashboard;

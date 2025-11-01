import React, { useEffect, useState } from "react";
import "./VolunteerDashboard.css";
import "../components/FilterButtons.css";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import ComplaintModal from "../components/ComplaintModal";
import StatusUpdateModal from "../components/StatusUpdateModal";
import { Button } from "../components/ui/button";
import { getAssignedComplaints, updateComplaintStatus } from "../services/api";
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
  Eye,
  Edit,
} from "lucide-react";

const VolunteerDashboard = () => {
  const [volunteerName, setVolunteerName] = useState("Volunteer");
  const [volunteerCode, setVolunteerCode] = useState("VOL00000");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [filters, setFilters] = useState({ status: "", category: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== "volunteer") {
          alert("Access denied. Only volunteers can access this page.");
          navigate("/login");
          return;
        }
        setVolunteerName(parsedUser.name || "Volunteer");
        setVolunteerCode(parsedUser.code || "VOL00000");
        fetchTasks();
      } catch (err) {
        console.error("Error parsing user:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchTasks = async (filterParams = {}) => {
    try {
      setLoading(true);
      const res = await getAssignedComplaints(filterParams);
      setTasks(res.complaints || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Remove empty filters
    const activeFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== "")
    );

    fetchTasks(activeFilters);
  };

  const clearFilters = () => {
    setFilters({ status: "", category: "" });
    fetchTasks();
  };

  const handleUpdateStatus = async (complaintId, status) => {
    try {
      await updateComplaintStatus(complaintId, status);
      await fetchTasks(); // Refresh data
      setShowStatusModal(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowComplaintModal(true);
  };

  const handleStatusClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowStatusModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Calculate stats from real data
  const activeProjects = tasks;
  const completedTasks = tasks.filter((t) => t.status === "resolved");
  const inProgressTasks = tasks.filter((t) => t.status === "in_review");

  const recentActivities = tasks.slice(0, 3).map((t) => ({
    action: `Updated "${t.title}" to ${t.status}`,
    time: new Date(t.updatedAt || t.createdAt).toLocaleDateString(),
  }));

  const performanceStats = [
    { name: "Hours Contributed", value: tasks.length * 2, trend: "8%" },
    {
      name: "Projects Completed",
      value: completedTasks.length,
      trend: completedTasks.length,
    },
    { name: "Impact Score", value: "85%", trend: "12%" },
    { name: "Active Tasks", value: inProgressTasks.length, trend: "5%" },
  ];

  return (
    <Layout userType="volunteer">
      <div className="volunteer-page">
        {/* Header */}
        <div className="volunteer-header">
          <div>
            <h1 className="volunteer-title">Welcome, {volunteerName} 💪</h1>
            <p className="volunteer-subtitle">
              Track your volunteering impact and manage community projects
              efficiently.
            </p>
          </div>
          <Button
            variant="outline"
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="volunteer-stats">
          <StatCard
            title="Total Hours"
            value={(tasks.length * 2).toString()}
            subtitle="estimated hours contributed"
            icon={Clock}
            iconColor="bg-yellow-100 text-yellow-700"
            trend={{ value: "8%", isPositive: true }}
          />
          <StatCard
            title="Assigned Tasks"
            value={activeProjects.length.toString()}
            subtitle="complaints assigned to you"
            icon={HeartHandshake}
            iconColor="bg-pink-100 text-pink-700"
            trend={{
              value: activeProjects.length.toString(),
              isPositive: true,
            }}
          />
          <StatCard
            title="Completed"
            value={completedTasks.length.toString()}
            subtitle="resolved complaints"
            icon={ThumbsUp}
            iconColor="bg-green-100 text-green-700"
            trend={{ value: "100%", isPositive: true }}
          />
          <StatCard
            title="In Progress"
            value={inProgressTasks.length.toString()}
            subtitle="currently working on"
            icon={Users}
            iconColor="bg-blue-100 text-blue-700"
            trend={{
              value: inProgressTasks.length.toString(),
              isPositive: true,
            }}
          />
        </div>

        {/* Volunteer Code Card */}
        <div className="volunteer-code-card">
          <div className="stat-card volunteer-code-inner">
            <div className="volunteer-code-content">
              <div className="volunteer-code-icon">
                <QrCode className="icon-size" />
              </div>
              <div>
                <h3 className="volunteer-code-title">Your Volunteer Code</h3>
                <p className="volunteer-code-text">{volunteerCode}</p>
              </div>
            </div>
            <Button size="sm" className="volunteer-code-btn">
              Copy Code
            </Button>
          </div>
        </div>

        {/* Alerts */}
        <div className="volunteer-alerts">
          <div className="alert-icon">
            <AlertCircle className="icon-size" />
          </div>
          <div className="alert-content">
            <h3 className="alert-title">No Upcoming Events</h3>
            <p className="alert-text">
              There are currently no scheduled volunteer events. Stay tuned for
              updates!
            </p>
            <Button size="sm" className="alert-btn">
              View Opportunities
            </Button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="volunteer-main-grid">
          {/* Active Projects / Assigned Petitions */}
          <div className="volunteer-main-col">
            <div className="stat-card volunteer-main-inner">
              <div className="section-header">
                <h2 className="section-title">
                  <Target className="icon-size" />
                  My Assigned Complaints
                </h2>
                <Button variant="outline" size="sm" className="view-all-btn">
                  Total: {activeProjects.length}
                </Button>
              </div>

              {/* Filter Buttons */}
              <div className="mb-4 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-medium text-gray-600 self-center">
                    Status:
                  </span>
                  <button
                    onClick={() => handleFilterChange("status", "")}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      filters.status === ""
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilterChange("status", "in_review")}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      filters.status === "in_review"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    In Review
                  </button>
                  <button
                    onClick={() => handleFilterChange("status", "resolved")}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      filters.status === "resolved"
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Resolved
                  </button>
                  <button
                    onClick={() => handleFilterChange("status", "rejected")}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      filters.status === "rejected"
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Rejected
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-medium text-gray-600 self-center">
                    Category:
                  </span>
                  <button
                    onClick={() => handleFilterChange("category", "")}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      filters.category === ""
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() =>
                      handleFilterChange("category", "infrastructure")
                    }
                    className={`px-3 py-1 text-xs rounded-full border ${
                      filters.category === "infrastructure"
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Infrastructure
                  </button>
                  <button
                    onClick={() =>
                      handleFilterChange("category", "public_safety")
                    }
                    className={`px-3 py-1 text-xs rounded-full border ${
                      filters.category === "public_safety"
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Public Safety
                  </button>
                  <button
                    onClick={() =>
                      handleFilterChange("category", "environment")
                    }
                    className={`px-3 py-1 text-xs rounded-full border ${
                      filters.category === "environment"
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Environment
                  </button>
                  <button
                    onClick={() =>
                      handleFilterChange("category", "transportation")
                    }
                    className={`px-3 py-1 text-xs rounded-full border ${
                      filters.category === "transportation"
                        ? "bg-indigo-500 text-white border-indigo-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Transportation
                  </button>
                  <button
                    onClick={() => handleFilterChange("category", "other")}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      filters.category === "other"
                        ? "bg-gray-500 text-white border-gray-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Other
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="empty-state">
                  <p className="empty-text">Loading assigned complaints...</p>
                </div>
              ) : activeProjects.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-text">
                    {Object.values(filters).some((f) => f !== "")
                      ? "No complaints match your filters."
                      : "🌱 No assigned complaints right now."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeProjects.map((complaint) => (
                    <div
                      key={complaint._id}
                      className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {complaint.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {complaint.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {complaint.location}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                              complaint.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : complaint.status === "in_review"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {complaint.status?.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewComplaint(complaint)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {complaint.status !== "resolved" && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusClick(complaint)}
                              className="bg-green-600 hover:bg-green-700 text-black"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="volunteer-sidebar">
            {/* Recent Activities */}
            <div className="stat-card activities-card">
              <h3 className="sidebar-title">
                <Calendar className="icon-small" />
                Recent Activities
              </h3>
              {recentActivities.length === 0 ? (
                <div className="empty-activities">
                  No recent activities yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="text-sm">
                      <p className="text-gray-700">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Performance Stats */}
            <div className="stat-card performance-card">
              <h3 className="performance-title">Your Performance</h3>
              <div className="performance-stats">
                {performanceStats.map((stat, index) => (
                  <div key={index} className="performance-item">
                    <span className="performance-name">{stat.name}</span>
                    <span className="performance-value">
                      {stat.value}{" "}
                      <span className="performance-trend">{stat.trend}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ComplaintModal
          complaint={selectedComplaint}
          isOpen={showComplaintModal}
          onClose={() => setShowComplaintModal(false)}
          onUpdateStatus={handleStatusClick}
          userRole="volunteer"
        />

        <StatusUpdateModal
          complaint={selectedComplaint}
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          onUpdate={handleUpdateStatus}
        />
      </div>
    </Layout>
  );
};

export default VolunteerDashboard;

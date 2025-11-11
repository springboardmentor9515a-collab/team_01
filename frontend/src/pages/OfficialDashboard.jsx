import React, { useEffect, useState } from "react";
import "./OfficialDashboard.css";
import "../components/FilterButtons.css";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import ComplaintModal from "../components/ComplaintModal";
import AssignComplaintModal from "../components/AssignComplaintModal";
import ResponseModal from "../components/ResponseModal";
import { Button } from "../components/ui/button";
import {
  getAllComplaints,
  assignComplaint,
  respondToComplaint,
} from "../services/api";
import {
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  AlertCircle,
  Calendar,
  Building2,
  Eye,
  MessageSquare,
} from "lucide-react";

const OfficialDashboard = () => {
  const [officialName, setOfficialName] = useState("Official");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    location: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== "admin" && parsedUser.role !== "official") {
          alert("Access denied. Only officials can access this page.");
          navigate("/login");
          return;
        }
        setOfficialName(parsedUser.name || "Official");
        fetchComplaints();
      } catch (err) {
        console.error("Error parsing user:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchComplaints = async (filterParams = {}) => {
    try {
      setLoading(true);
      const response = await getAllComplaints(filterParams);
      setComplaints(response.complaints || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
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

    fetchComplaints(activeFilters);
  };

  const clearFilters = () => {
    setFilters({ status: "", category: "", location: "" });
    fetchComplaints();
  };

  const handleAssignComplaint = async (complaintId, volunteerId) => {
    try {
      await assignComplaint(complaintId, volunteerId);
      await fetchComplaints(); // Refresh data
      setShowAssignModal(false);
    } catch (error) {
      console.error("Error assigning complaint:", error);
    }
  };

  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowComplaintModal(true);
  };

  const handleAssignClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowAssignModal(true);
  };

  const handleAddResponse = (complaint) => {
    setSelectedComplaint(complaint);
    setShowResponseModal(true);
  };

  const handleSubmitResponse = async (complaintId, response) => {
    try {
      await respondToComplaint(complaintId, response);
      await fetchComplaints();
      setShowResponseModal(false);
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Calculate stats from real data
  const pendingComplaints = complaints.filter((c) => c.status === "pending");
  const approvedComplaints = complaints.filter((c) => c.status === "resolved");
  const inReviewComplaints = complaints.filter((c) => c.status === "in_review");

  const recentActions = complaints.slice(0, 5).map((c) => ({
    action: `Complaint "${c.title}" ${c.status}`,
    time: new Date(c.createdAt).toLocaleDateString(),
  }));

  const departmentMetrics = [
    {
      name: "Public Works",
      pending: pendingComplaints.length,
      approved: approvedComplaints.length,
      avgTime: "2 days",
    },
    { name: "Education", pending: 0, approved: 0, avgTime: "0 days" },
    { name: "Public Safety", pending: 0, approved: 0, avgTime: "0 days" },
    { name: "Transportation", pending: 0, approved: 0, avgTime: "0 days" },
  ];

  return (
    <Layout userType="official">
      <div className="official-page">
        {/* Header */}
        <div className="official-header">
          <div>
            <h1 className="official-title">Welcome back, {officialName} 👋</h1>
            <p className="official-subtitle">
              Manage petitions, review community requests, and track civic
              engagement efficiently.
            </p>
          </div>
          <div className="header-buttons">
            <Button
              variant="outline"
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="official-stats">
          <StatCard
            title="Pending Review"
            value={pendingComplaints.length.toString()}
            subtitle="complaints awaiting review"
            icon={Clock}
            iconColor="bg-yellow-100 text-yellow-700"
            trend={{
              value: `${pendingComplaints.length} new`,
              isPositive: false,
            }}
          />
          <StatCard
            title="Resolved This Month"
            value={approvedComplaints.length.toString()}
            subtitle="complaints resolved"
            icon={CheckCircle2}
            iconColor="bg-green-100 text-green-600"
            trend={{ value: "100%", isPositive: true }}
          />
          <StatCard
            title="In Review"
            value={inReviewComplaints.length.toString()}
            subtitle="complaints being processed"
            icon={Users}
            iconColor="bg-blue-100 text-blue-700"
            trend={{ value: `${inReviewComplaints.length}`, isPositive: true }}
          />
          <StatCard
            title="Total Complaints"
            value={complaints.length.toString()}
            subtitle="all complaints"
            icon={TrendingUp}
            iconColor="bg-indigo-100 text-indigo-700"
            trend={{ value: `${complaints.length} total`, isPositive: true }}
          />
        </div>

        {/* Priority Alerts */}
        <div className="official-priority-alerts">
          <div className="alert-icon">
            <AlertCircle className="icon-size" />
          </div>
          <div className="alert-content">
            <h3 className="alert-title">
              {pendingComplaints.length > 0
                ? `${pendingComplaints.length} Pending Complaints`
                : "No Priority Items"}
            </h3>
            <p className="alert-text">
              {pendingComplaints.length > 0
                ? "There are complaints requiring your attention and assignment."
                : "There are currently no complaints requiring urgent attention."}
            </p>
            <Button
              size="sm"
              className={
                pendingComplaints.length > 0
                  ? "alert-btn"
                  : "alert-btn-disabled"
              }
              disabled={pendingComplaints.length === 0}
            >
              Review Priority Items
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="official-main-grid">
          <div className="official-main-col">
            <div className="stat-card official-main-inner">
              <div className="section-header">
                <h2 className="section-title">
                  <FileText className="icon-size" />
                  Complaints Management
                </h2>
                <Button variant="outline" size="sm" className="view-all-btn">
                  Total: {complaints.length}
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

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-medium text-gray-600">
                    Location:
                  </span>
                  <button
                    onClick={() => handleFilterChange("location", "")}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      filters.location === ""
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    All Locations
                  </button>
                  <input
                    type="text"
                    placeholder="Search by location..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    className="px-3 py-1 text-xs border border-gray-300 rounded-full focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    style={{ minWidth: "150px" }}
                  />
                </div>
              </div>
              {loading ? (
                <div className="empty-state">
                  <p className="empty-text">Loading complaints...</p>
                </div>
              ) : complaints.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-text">
                    {Object.values(filters).some((f) => f !== "")
                      ? "No complaints match your filters."
                      : "✅ No complaints available for review right now."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {complaints.slice(0, 5).map((complaint) => (
                    <div
                      key={complaint._id}
                      className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {complaint.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {complaint.location}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Status:{" "}
                            {complaint.status?.replace("_", " ").toUpperCase()}
                          </p>
                          {complaint.official_response && (
                            <p className="text-xs text-green-600 mt-1 font-medium">
                              ✓ Response Added
                            </p>
                          )}
                          {complaint.assigned_to && (
                            <p className="text-xs text-blue-600 mt-1">
                              Assigned to: {complaint.assigned_to.name}
                            </p>
                          )}
                          {complaint.status_history &&
                            complaint.status_history.length > 0 && (
                              <p className="text-xs text-purple-600 mt-1">
                                Progress Updates:{" "}
                                {complaint.status_history.length}
                              </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewComplaint(complaint)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddResponse(complaint)}
                            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                          >
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                          {!complaint.assigned_to && (
                            <Button
                              size="sm"
                              onClick={() => handleAssignClick(complaint)}
                              className="bg-blue-600 hover:bg-blue-700 text-black"
                            >
                              Assign
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

          <div className="official-sidebar">
            {/* Recent Actions */}
            <div className="stat-card actions-card">
              <h3 className="sidebar-title">
                <Calendar className="icon-small" />
                Recent Actions
              </h3>
              {recentActions.length === 0 ? (
                <p className="empty-actions">No recent actions yet.</p>
              ) : (
                <div className="actions-list space-y-2">
                  {recentActions.map((action, index) => (
                    <div key={index} className="text-sm">
                      <p className="text-gray-700">{action.action}</p>
                      <p className="text-xs text-gray-500">{action.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Department Metrics */}
            <div className="stat-card department-card">
              <h3 className="sidebar-title">
                <Building2 className="icon-small" />
                Department Overview
              </h3>
              <div className="department-list">
                {departmentMetrics.map((dept, index) => (
                  <div key={index} className="department-item">
                    <div className="department-name">{dept.name}</div>
                    <div className="department-stats">
                      <div className="department-stat">
                        <div className="stat-label">Pending</div>
                        <div className="stat-value stat-value-pending">
                          {dept.pending}
                        </div>
                      </div>
                      <div className="department-stat">
                        <div className="stat-label">Approved</div>
                        <div className="stat-value stat-value-approved">
                          {dept.approved}
                        </div>
                      </div>
                      <div className="department-stat">
                        <div className="stat-label">Avg Time</div>
                        <div className="stat-value">{dept.avgTime}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="stat-card community-card">
              <h3 className="community-title">Community Engagement</h3>
              <div className="community-stats">
                <div className="community-stat">
                  <span className="community-stat-label">Total Complaints</span>
                  <span className="community-stat-value community-stat-primary">
                    {complaints.length}
                  </span>
                </div>
                <div className="community-stat">
                  <span className="community-stat-label">Pending Review</span>
                  <span className="community-stat-value community-stat-primary">
                    {pendingComplaints.length}
                  </span>
                </div>
                <div className="community-stat">
                  <span className="community-stat-label">
                    Participation Rate
                  </span>
                  <span className="community-stat-value community-stat-success">
                    0%
                  </span>
                </div>
                <div className="community-stat">
                  <span className="community-stat-label">
                    Satisfaction Score
                  </span>
                  <span className="community-stat-value community-stat-info">
                    0 / 5.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ComplaintModal
          complaint={selectedComplaint}
          isOpen={showComplaintModal}
          onClose={() => setShowComplaintModal(false)}
          onAssign={handleAssignClick}
          userRole="admin"
        />

        <AssignComplaintModal
          complaint={selectedComplaint}
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignComplaint}
        />

        <ResponseModal
          complaint={selectedComplaint}
          isOpen={showResponseModal}
          onClose={() => setShowResponseModal(false)}
          onSubmit={handleSubmitResponse}
        />
      </div>
    </Layout>
  );
};

export default OfficialDashboard;

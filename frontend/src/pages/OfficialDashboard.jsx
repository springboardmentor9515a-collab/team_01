import React, { useEffect, useState } from "react";
import "./OfficialDashboard.css";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { Button } from "../components/ui/button";
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
      } catch (err) {
        console.error("Error parsing user:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Sample data placeholders
  const pendingPetitions = [];
  const recentActions = [];
  const departmentMetrics = [
    { name: "Public Works", pending: 0, approved: 0, avgTime: "0 days" },
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
          <Button
            variant="outline"
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="official-stats">
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
        <div className="official-priority-alerts">
          <div className="alert-icon">
            <AlertCircle className="icon-size" />
          </div>
          <div className="alert-content">
            <h3 className="alert-title">No Priority Items</h3>
            <p className="alert-text">
              There are currently no petitions requiring urgent attention.
            </p>
            <Button size="sm" className="alert-btn-disabled" disabled>
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
                  Petitions Awaiting Review
                </h2>
                <Button variant="outline" size="sm" className="view-all-btn">
                  View All
                </Button>
              </div>
              {pendingPetitions.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-text">
                    ✅ No petitions available for review right now.
                  </p>
                </div>
              ) : (
                <div>Petition List...</div>
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
                <div className="actions-list">{/* dynamic actions */}</div>
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
                  <span className="community-stat-label">Total Petitions</span>
                  <span className="community-stat-value community-stat-primary">
                    0
                  </span>
                </div>
                <div className="community-stat">
                  <span className="community-stat-label">Active Polls</span>
                  <span className="community-stat-value community-stat-primary">
                    0
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
      </div>
    </Layout>
  );
};

export default OfficialDashboard;

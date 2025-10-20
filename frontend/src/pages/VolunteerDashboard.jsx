import React, { useEffect, useState } from "react";
import "./VolunteerDashboard.css";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { Button } from "../components/ui/button";
import { getAssignedComplaints } from "../services/api";
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
  const [tasks, setTasks] = useState([]);
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

  const fetchTasks = async () => {
    try {
      const res = await getAssignedComplaints();
      setTasks(res.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Placeholder data
  const activeProjects = tasks;
  const recentActivities = [];
  const performanceStats = [
    { name: "Hours Contributed", value: "0", trend: "0%" },
    { name: "Projects Completed", value: "0", trend: "0" },
    { name: "Impact Score", value: "0%", trend: "0%" },
    { name: "Active Teams", value: "0", trend: "0%" },
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
            value="0"
            subtitle="volunteered this month"
            icon={Clock}
            iconColor="bg-yellow-100 text-yellow-700"
            trend={{ value: "0%", isPositive: true }}
          />
          <StatCard
            title="Projects Joined"
            value={activeProjects.length}
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
                  Assigned Petitions
                </h2>
                <Button variant="outline" size="sm" className="view-all-btn">
                  View All
                </Button>
              </div>

              {activeProjects.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-text">
                    🌱 No assigned petitions right now.
                  </p>
                </div>
              ) : (
                activeProjects.map((t) => (
                  <div key={t._id} className="task-card">
                    <h3 className="task-title">{t.title}</h3>
                    <p className="task-description">{t.description}</p>
                    <p className="task-location">Location: {t.location}</p>
                  </div>
                ))
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
                <div>Activities list...</div>
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
      </div>
    </Layout>
  );
};

export default VolunteerDashboard;

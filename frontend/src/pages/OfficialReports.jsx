import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { getAllComplaints, getAllPolls } from "../services/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import {
  FileText,
  Download,
  BarChart3,
  Calendar,
  MapPin,
  Users,
  ChevronDown,
  FileSpreadsheet,
  TrendingUp,
} from "lucide-react";
import "./OfficialReports.css";

const OfficialReports = () => {
  const [complaints, setComplaints] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [officialName, setOfficialName] = useState("Official");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "admin" && parsedUser.role !== "official") {
        navigate("/login");
        return;
      }
      setOfficialName(parsedUser.name || "Official");
      fetchData();
    } catch (err) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest('.export-dropdown')) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [complaintsRes, pollsRes] = await Promise.all([
        getAllComplaints().catch(() => ({ complaints: [] })),
        getAllPolls().catch(() => ({ polls: [] })),
      ]);
      setComplaints(complaintsRes.complaints || []);
      setPolls(pollsRes.polls || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    setShowExportMenu(false);
    
    const petitionStats = {
      total: complaints.length,
      resolved: complaints.filter(c => c.status === "resolved").length,
    };
    
    const pollStats = {
      total: polls.length,
    };
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Official Reports</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          h1 { color: #1a237e; border-bottom: 3px solid #1a237e; padding-bottom: 10px; }
          h2 { color: #1a237e; margin-top: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
          .header { margin-bottom: 30px; }
          .info { margin: 5px 0; color: #6b7280; }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
          .stat-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; }
          .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
          .stat-value { font-size: 32px; font-weight: bold; color: #111827; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #1a237e; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Official Reports Dashboard</h1>
          <p class="info"><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p class="info"><strong>Official:</strong> ${officialName}</p>
        </div>

        <h2>Summary Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Petitions</div>
            <div class="stat-value">${petitionStats.total}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Polls</div>
            <div class="stat-value">${pollStats.total}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Resolved Petitions</div>
            <div class="stat-value">${petitionStats.resolved}</div>
          </div>
        </div>

        <h2>Petition Details</h2>
        <table>
          <tr><th>Title</th><th>Location</th><th>Status</th><th>Date</th></tr>
          ${complaints.slice(0, 10).map(c => `
            <tr>
              <td>${c.title}</td>
              <td>${c.location}</td>
              <td>${c.status?.replace('_', ' ').toUpperCase()}</td>
              <td>${new Date(c.createdAt).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </table>

        <h2>Poll Details</h2>
        <table>
          <tr><th>Title</th><th>Status</th><th>Date</th></tr>
          ${polls.slice(0, 10).map(p => `
            <tr>
              <td>${p.title}</td>
              <td>Active</td>
              <td>${new Date(p.createdAt || Date.now()).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </table>

        <div class="footer">
          <p>© ${new Date().getFullYear()} Official Portal. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow pop-ups to generate PDF");
      return;
    }
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const downloadCSV = () => {
    setShowExportMenu(false);
    
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `official-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReportContent = () => {
    return `OFFICIAL REPORTS - ${new Date().toLocaleDateString()}

PETITION SUMMARY:
Total Petitions: ${complaints.length}
Resolved: ${complaints.filter(c => c.status === "resolved").length}
In Review: ${complaints.filter(c => c.status === "in_review").length}
Pending: ${complaints.filter(c => c.status === "received").length}

POLL SUMMARY:
Total Polls: ${polls.length}
Active Polls: ${polls.filter(p => p.status === "active").length}

PETITION DETAILS:
${complaints.map(c => `- ${c.title} | ${c.location} | ${c.status}`).join("\n")}

POLL DETAILS:
${polls.map(p => `- ${p.title} | ${p.location || "N/A"} | ${p.status || "active"}`).join("\n")}`;
  };

  const generateCSVContent = () => {
    const headers = "Type,Title,Location,Status,Created Date\n";
    const petitionRows = complaints.map(c => 
      `Petition,"${c.title}","${c.location}","${c.status}","${new Date(c.createdAt).toLocaleDateString()}"`
    ).join("\n");
    const pollRows = polls.map(p => 
      `Poll,"${p.title}","${p.location || "N/A"}","${p.status || "active"}","${new Date(p.createdAt || Date.now()).toLocaleDateString()}"`
    ).join("\n");
    return headers + petitionRows + "\n" + pollRows;
  };

  const petitionStats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === "resolved").length,
    inReview: complaints.filter(c => c.status === "in_review").length,
    pending: complaints.filter(c => c.status === "received").length,
  };

  const pollStats = {
    total: polls.length,
    active: polls.filter(p => p.status === "active").length,
  };

  const petitionStatusData = [
    { name: "Resolved", value: petitionStats.resolved, color: "#10B981" },
    { name: "In Review", value: petitionStats.inReview, color: "#3B82F6" },
    { name: "Pending", value: petitionStats.pending, color: "#F59E0B" },
  ];

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent === 0) return null;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textAnchor = x > cx ? 'start' : 'end';
    return (
      <text x={x} y={y} textAnchor={textAnchor} fill="#374151" fontSize="13" fontWeight="500">
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Layout userType="official">
      <div className="reports-page">
        <div className="report-header">
          <div className="report-header-left">
            <div className="user-avatar">
              <span className="avatar-text">
                {officialName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="user-info">
              <h2 className="user-name">{officialName}</h2>
              <p className="user-email">City Official</p>
              <p className="user-location">Official Portal</p>
            </div>
          </div>
          <div className="export-dropdown">
            <Button
              variant="outline"
              className="export-btn"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download size={16} />
              Export Data
              <ChevronDown size={16} />
            </Button>
            {showExportMenu && (
              <div className="export-menu">
                <button className="export-menu-item" onClick={downloadCSV}>
                  <FileSpreadsheet size={16} />
                  Export as CSV
                </button>
                <button className="export-menu-item" onClick={downloadPDF}>
                  <FileText size={16} />
                  Export as PDF
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="report-content">
          <div className="report-title-section">
            <h1 className="report-main-title">Official Reports Dashboard</h1>
            <p className="report-subtitle">
              Monitor petition and poll statistics across the platform.
            </p>
          </div>

        {loading ? (
          <div className="loading">Loading reports...</div>
        ) : (
          <>
            <div className="report-stats-grid">
              <div className="report-stat-card">
                <div className="stat-header">
                  <span className="stat-label">Total Petitions</span>
                  <div className="stat-icon">
                    <FileText size={20} />
                  </div>
                </div>
                <div className="stat-value">{petitionStats.total}</div>
                <div className="stat-trend positive">
                  <TrendingUp size={14} />
                  {petitionStats.total} total submissions
                </div>
              </div>

              <div className="report-stat-card">
                <div className="stat-header">
                  <span className="stat-label">Total Polls</span>
                  <div className="stat-icon">
                    <BarChart3 size={20} />
                  </div>
                </div>
                <div className="stat-value">{pollStats.total}</div>
                <div className="stat-trend positive">
                  <TrendingUp size={14} />
                  {pollStats.active} active polls
                </div>
              </div>

              <div className="report-stat-card">
                <div className="stat-header">
                  <span className="stat-label">Resolved Petitions</span>
                  <div className="stat-icon">
                    <Users size={20} />
                  </div>
                </div>
                <div className="stat-value">{petitionStats.resolved}</div>
                <div className="stat-subtitle">Successfully resolved</div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3 className="chart-title">Petition Status Distribution</h3>
                <p className="chart-subtitle">Breakdown of petition statuses</p>
                <div className="chart-container">
                  {petitionStats.total === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#6b7280' }}>
                      <div style={{ textAlign: 'center' }}>
                        <p>No petitions submitted yet</p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={petitionStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={CustomLabel}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {petitionStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="chart-card">
                <h3 className="chart-title">Recent Activity</h3>
                <p className="chart-subtitle">Latest petitions and polls</p>
                <div className="activity-list">
                  {complaints.slice(0, 3).map((complaint) => (
                    <div key={complaint._id} className="activity-item">
                      <div className="activity-icon petition">
                        <FileText size={16} />
                      </div>
                      <div className="activity-content">
                        <h4>{complaint.title}</h4>
                        <p>{complaint.location}</p>
                        <span className={`activity-status ${complaint.status}`}>
                          {complaint.status?.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {polls.slice(0, 2).map((poll) => (
                    <div key={poll._id} className="activity-item">
                      <div className="activity-icon poll">
                        <BarChart3 size={16} />
                      </div>
                      <div className="activity-content">
                        <h4>{poll.title}</h4>
                        <p>Poll created</p>
                        <span className="activity-status active">ACTIVE</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </Layout>
  );
};

export default OfficialReports;
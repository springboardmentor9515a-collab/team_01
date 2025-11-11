import { useState, useEffect } from "react";
import "./Report.css";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Download, TrendingUp, ChevronDown, FileText, FileSpreadsheet } from "lucide-react";
import { getMyComplaints, getAllComplaints } from "../services/api";

const ReportDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role;
  const layoutUserType = role === "admin" || role === "official" ? "official" : role === "volunteer" ? "volunteer" : "citizen";
  const [userName, setUserName] = useState("Citizen");
  const [userEmail, setUserEmail] = useState("");
  const [location, setLocation] = useState("San Diego, CA");
  const [activeTab, setActiveTab] = useState("community");
  const [loading, setLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Stats from backend
  const [stats, setStats] = useState({
    totalComplaints: 0,
    complaintIncrease: "Loading...",
    successfulComplaints: 0,
    successRate: "Loading...",
    activeComplaints: 0,
    engagementSubtitle: "Your complaint activity"
  });

  // Complaint status data from backend
  const [complaintStatusData, setComplaintStatusData] = useState([
    { name: "Active", value: 0, color: "#0F4C5C" },
    { name: "Under Review", value: 0, color: "#FFA500" },
    { name: "Resolved", value: 0, color: "#10B981" },
    { name: "Closed", value: 0, color: "#E74C3C" }
  ]);

  // Complaint success data
  const [complaintSuccessData, setComplaintSuccessData] = useState([
    { name: "Successful", value: 0, color: "#10B981" },
    { name: "Unsuccessful", value: 0, color: "#E74C3C" },
    { name: "Pending", value: 0, color: "#F59E0B" }
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.name) setUserName(parsedUser.name);
        else if (parsedUser.fullName) setUserName(parsedUser.fullName);
        if (parsedUser.email) setUserEmail(parsedUser.email);
        if (parsedUser.location) setLocation(parsedUser.location);
        
        // Fetch actual data from backend
        fetchReportData();
      } catch (err) {
        console.error("Error parsing user:", err);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest('.export-dropdown')) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  const fetchReportData = async () => {
    setLoading(true);
    
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    console.log("=== DEBUGGING REPORT DATA ===");
    console.log("Token exists:", !!token);
    console.log("Token value:", token ? token.substring(0, 20) + '...' : 'null');
    console.log("User exists:", !!storedUser);
    
    if (!token) {
      console.error("❌ No authentication token found");
      alert("Please log in again to view your data");
      navigate("/login");
      return;
    }
    
    if (!storedUser) {
      console.error("❌ No user data found");
      alert("User data not found. Please log in again.");
      navigate("/login");
      return;
    }
    
    try {
      console.log("🔄 Fetching report data from backend...");
      const parsedUser = JSON.parse(storedUser);
      console.log("👤 User data:", parsedUser);
      console.log("🔑 Using token:", token ? 'YES' : 'NO');
      
      // Fetch user's complaints
      let complaints = [];
      
      try {
        console.log("📞 Making API call to getMyComplaints...");
        const complaintsResponse = await getMyComplaints();
        
        console.log("📦 API Response received:");
        console.log("- Response:", complaintsResponse);
        console.log("- Type:", typeof complaintsResponse);
        console.log("- Keys:", Object.keys(complaintsResponse || {}));
        
        if (complaintsResponse && complaintsResponse.complaints) {
          complaints = complaintsResponse.complaints;
          console.log("✅ Found complaints in response.complaints:", complaints.length);
        } else {
          console.log("❌ No complaints found in response");
          complaints = [];
        }
      } catch (apiError) {
        console.error("❌ API call failed:", apiError);
        console.log("🔄 API might not support query parameters, trying without...");
        complaints = [];
      }
      
      console.log("📊 FINAL COMPLAINT COUNT:", complaints.length);
      
      if (complaints.length > 0) {
        console.log("🔍 Sample complaint:", complaints[0]);
      } else {
        console.log("⚠️ No complaints found for this user - will show empty state");
      }
      
      // ALWAYS process data even if empty to show proper UI
      console.log("📊 Processing complaint data (even if empty)...");
      
      // Log actual statuses to debug
      const actualStatuses = complaints.map(c => c.status);
      console.log("Actual complaint statuses from backend:", actualStatuses);
      console.log("Unique statuses:", [...new Set(actualStatuses)]);
      
      // Calculate complaint status breakdown using correct backend status values
      const activeCount = complaints.filter(c => c.status === "received" || c.status === "active" || c.status === "assigned").length;
      const underReviewCount = complaints.filter(c => c.status === "in_review" || c.status === "under_review").length;
      const resolvedCount = complaints.filter(c => c.status === "resolved").length;
      const closedCount = complaints.filter(c => c.status === "closed" || c.status === "responded").length;
      
      console.log("Complaint counts:", { activeCount, underReviewCount, resolvedCount, closedCount, total: complaints.length });
      
      // Calculate success metrics
      const successfulCount = resolvedCount; // Resolved = Successful
      const unsuccessfulCount = closedCount; // Closed/Responded without resolution = Unsuccessful
      const pendingCount = activeCount + underReviewCount; // Active + Under Review = Pending
      
      // Update complaint status data for pie chart
      const newComplaintStatusData = [
        { name: "Active", value: activeCount, color: "#0F4C5C" },
        { name: "Under Review", value: underReviewCount, color: "#FFA500" },
        { name: "Resolved", value: resolvedCount, color: "#10B981" },
        { name: "Closed", value: closedCount, color: "#E74C3C" }
      ];
      console.log("📈 SETTING COMPLAINT STATUS DATA:", newComplaintStatusData);
      setComplaintStatusData(newComplaintStatusData);
      
      // Update complaint success data for pie chart
      const newComplaintSuccessData = [
        { name: "Successful", value: successfulCount, color: "#10B981" },
        { name: "Unsuccessful", value: unsuccessfulCount, color: "#E74C3C" },
        { name: "Pending", value: pendingCount, color: "#F59E0B" }
      ];
      console.log("📈 SETTING COMPLAINT SUCCESS DATA:", newComplaintSuccessData);
      setComplaintSuccessData(newComplaintSuccessData);
      
      // Calculate success rate
      const totalComplaintsCount = complaints.length;
      const successRate = totalComplaintsCount > 0 ? Math.round((successfulCount / totalComplaintsCount) * 100) : 0;
      
      // Update stats
      // Update stats - ALWAYS update even if 0
      const newStats = {
        totalComplaints: totalComplaintsCount,
        complaintIncrease: totalComplaintsCount > 0 ? `${totalComplaintsCount} total complaints` : "No complaints yet",
        successfulComplaints: successfulCount,
        successRate: `${successRate}% success rate`,
        activeComplaints: pendingCount,
        engagementSubtitle: "Your complaint activity"
      };
      
      console.log("📊 SETTING STATS:", newStats);
      setStats(newStats);
      
    } catch (error) {
      console.error("❌ ERROR in fetchReportData:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);
      
      // Show user-friendly error
      alert(`Failed to load complaints: ${error.message}\n\nPlease check:\n1. Backend is running on http://localhost:5000\n2. You are logged in\n3. Network connection`);
      
      // Set default data even on error so charts show
      setComplaintStatusData([
        { name: "Active", value: 0, color: "#0F4C5C" },
        { name: "Under Review", value: 0, color: "#FFA500" },
        { name: "Resolved", value: 0, color: "#10B981" },
        { name: "Closed", value: 0, color: "#E74C3C" }
      ]);
      
      setComplaintSuccessData([
        { name: "Successful", value: 0, color: "#10B981" },
        { name: "Unsuccessful", value: 0, color: "#E74C3C" },
        { name: "Pending", value: 0, color: "#F59E0B" }
      ]);
      
      setStats({
        totalComplaints: 0,
        complaintIncrease: "Error loading data",
        successfulComplaints: 0,
        successRate: "Error loading data",
        activeComplaints: 0,
        engagementSubtitle: "Failed to load data - check backend connection"
      });
    } finally {
      console.log("✅ Setting loading to false - UI should update now");
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setShowExportMenu(false);
    
    try {
      // Create CSV content using current state data
      let csvContent = "Civic Engagement Report\n";
      csvContent += `Generated: ${new Date().toLocaleString()}\n`;
      csvContent += `User: ${userName}\n`;
      csvContent += `Email: ${userEmail}\n`;
      csvContent += `Location: ${location}\n\n`;
      
      // Statistics from current state
      csvContent += "STATISTICS\n";
      csvContent += `Total Complaints,${stats.totalComplaints}\n`;
      csvContent += `Successful Complaints,${stats.successfulComplaints}\n`;
      csvContent += `Success Rate,${stats.successRate}\n`;
      csvContent += `Active Complaints,${stats.activeComplaints}\n\n`;
      
      // Complaint Status Breakdown from current state
      csvContent += "COMPLAINT STATUS BREAKDOWN\n";
      csvContent += "Status,Count\n";
      complaintStatusData.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
      csvContent += "\n";
      
      // Complaint Success Breakdown from current state
      csvContent += "COMPLAINT SUCCESS BREAKDOWN\n";
      csvContent += "Result,Count\n";
      complaintSuccessData.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `civic-engagement-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert(`Export error: ${error.message}`);
    }
  };

  const handleExportPDF = async () => {
    setShowExportMenu(false);
    
    try {
      
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Civic Engagement Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            h1 { color: #0F4C5C; border-bottom: 3px solid #0F4C5C; padding-bottom: 10px; }
            h2 { color: #0F4C5C; margin-top: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
            .header { margin-bottom: 30px; }
            .info { margin: 5px 0; color: #6b7280; }
            .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
            .stat-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; }
            .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
            .stat-value { font-size: 32px; font-weight: bold; color: #111827; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #0F4C5C; color: white; padding: 12px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            tr:hover { background: #f9fafb; }
            .breakdown { display: flex; gap: 20px; margin: 20px 0; }
            .breakdown-item { flex: 1; background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
            .breakdown-label { font-weight: 600; color: #374151; }
            .breakdown-value { font-size: 24px; font-weight: bold; color: #0F4C5C; margin-top: 5px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Civic Engagement Report</h1>
            <p class="info"><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p class="info"><strong>User:</strong> ${userName}</p>
            <p class="info"><strong>Email:</strong> ${userEmail}</p>
            <p class="info"><strong>Location:</strong> ${location}</p>
          </div>

          <h2>Summary Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Total Complaints</div>
              <div class="stat-value">${stats.totalComplaints}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Successful Complaints</div>
              <div class="stat-value">${stats.successfulComplaints}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Success Rate</div>
              <div class="stat-value">${stats.successRate}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Active Complaints</div>
              <div class="stat-value">${stats.activeComplaints}</div>
            </div>
          </div>

          <h2>Complaint Status Breakdown</h2>
          <div class="breakdown">
            ${complaintStatusData.map(item => `
              <div class="breakdown-item">
                <div class="breakdown-label">${item.name}</div>
                <div class="breakdown-value">${item.value}</div>
              </div>
            `).join('')}
          </div>

          <h2>Complaint Success Analysis</h2>
          <div class="breakdown">
            ${complaintSuccessData.map(item => `
              <div class="breakdown-item">
                <div class="breakdown-label">${item.name}</div>
                <div class="breakdown-value">${item.value}</div>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>This report was generated automatically from your civic engagement data.</p>
            <p>  ${new Date().getFullYear()} Civic Engagement Platform. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;
      
      // Open print dialog for PDF
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error("Failed to open print window. Please allow pop-ups for this site.");
      }
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
      }, 500);
      
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert(`Export error: ${error.message}`);
    }
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
    const RADIAN = Math.PI / 180;
    
    if (percent === 0) return null;

    // Calculate position for the label line
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Line start point (edge of pie)
    const sx = cx + outerRadius * Math.cos(-midAngle * RADIAN);
    const sy = cy + outerRadius * Math.sin(-midAngle * RADIAN);
    
    // Line end point (before text)
    const mx = cx + (outerRadius + 20) * Math.cos(-midAngle * RADIAN);
    const my = cy + (outerRadius + 20) * Math.sin(-midAngle * RADIAN);
    
    const textAnchor = x > cx ? 'start' : 'end';

    return (
      <g>
        {/* Line from pie to label */}
        <path d={`M${sx},${sy}L${mx},${my}L${x},${y}`} stroke="#9ca3af" strokeWidth={1} fill="none" />
        {/* Label text */}
        <text
          x={x}
          y={y}
          textAnchor={textAnchor}
          fill="#374151"
          fontSize="13"
          fontWeight="500"
        >
          {`${name}: ${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  return (
    <Layout userType={layoutUserType}>
      <div className="report-dashboard">
        {/* Header Section */}
        <div className="report-header">
          <div className="report-header-left">
            <div className="user-avatar">
              <span className="avatar-text">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="user-info">
              <h2 className="user-name">{userName}</h2>
              <p className="user-email">{userEmail}</p>
              <p className="user-location">{location}</p>
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
                <button className="export-menu-item" onClick={handleExportCSV}>
                  <FileSpreadsheet size={16} />
                  Export as CSV
                </button>
                <button className="export-menu-item" onClick={handleExportPDF}>
                  <FileText size={16} />
                  Export as PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="report-content">
          <div className="report-title-section">
            <h1 className="report-main-title">My Complaint Reports</h1>
            <p className="report-subtitle">
              Track your complaint submissions and measure their success rate.
            </p>
          </div>

          {/* Stats Cards */}
          {loading ? (
            <div className="report-stats-grid">
              <div className="report-stat-card">
                <div className="stat-label">Loading...</div>
              </div>
              <div className="report-stat-card">
                <div className="stat-label">Loading...</div>
              </div>
              <div className="report-stat-card">
                <div className="stat-label">Loading...</div>
              </div>
            </div>
          ) : (
            <div className="report-stats-grid">
              <div className="report-stat-card">
                <div className="stat-header">
                  <span className="stat-label">Total Complaints</span>
                  <div className="stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                </div>
                <div className="stat-value">{stats.totalComplaints}</div>
                <div className="stat-trend positive">
                  <TrendingUp size={14} />
                  {stats.complaintIncrease}
                </div>
              </div>

              <div className="report-stat-card">
                <div className="stat-header">
                  <span className="stat-label">Successful Complaints</span>
                  <div className="stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                </div>
                <div className="stat-value">{stats.successfulComplaints}</div>
                <div className="stat-trend positive">
                  <TrendingUp size={14} />
                  {stats.successRate}
                </div>
              </div>

              <div className="report-stat-card">
                <div className="stat-header">
                  <span className="stat-label">Active Complaints</span>
                  <div className="stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                </div>
                <div className="stat-value">{stats.activeComplaints}</div>
                <div className="stat-subtitle">{stats.engagementSubtitle}</div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="report-tabs">
            <button
              className={`tab-button ${activeTab === "community" ? "active" : ""}`}
              onClick={() => setActiveTab("community")}
            >
              Community Overview
            </button>
            <button
              className={`tab-button ${activeTab === "activity" ? "active" : ""}`}
              onClick={() => setActiveTab("activity")}
            >
              My Activity
            </button>
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            {/* Complaint Status Breakdown */}
            <div className="chart-card">
              <h3 className="chart-title">Complaint Status Breakdown</h3>
              <p className="chart-subtitle">Distribution of complaints by current status</p>
              <div className="chart-container">
                {stats.totalComplaints === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#6b7280' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p>No complaints submitted yet</p>
                      <p style={{ fontSize: '14px' }}>Submit your first complaint to see statistics</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={complaintStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={CustomLabel}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {complaintStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          iconType="circle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Complaint Success Analysis */}
            <div className="chart-card">
              <h3 className="chart-title">Complaint Success Analysis</h3>
              <p className="chart-subtitle">Success rate of your submitted complaints</p>
              <div className="chart-container">
                {stats.totalComplaints === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#6b7280' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p>No complaints to analyze yet</p>
                      <p style={{ fontSize: '14px' }}>Submit complaints to see success analysis</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={complaintSuccessData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={CustomLabel}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {complaintSuccessData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          iconType="circle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportDashboard;
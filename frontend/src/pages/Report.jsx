import { useState, useEffect } from "react";
import "./Report.css";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Download, TrendingUp, ChevronDown, FileText, FileSpreadsheet } from "lucide-react";
import { getMyComplaints, getAllComplaints, getAllPolls } from "../services/api";

const ReportDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Citizen");
  const [userEmail, setUserEmail] = useState("");
  const [location, setLocation] = useState("San Diego, CA");
  const [activeTab, setActiveTab] = useState("community");
  const [loading, setLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Stats from backend
  const [stats, setStats] = useState({
    totalPetitions: 0,
    petitionIncrease: "Loading...",
    totalPolls: 0,
    pollIncrease: "Loading...",
    activeEngagement: 0,
    engagementSubtitle: "Active petitions and polls"
  });

  // Petition status data from backend
  const [petitionData, setPetitionData] = useState([
    { name: "Active", value: 0, color: "#0F4C5C" },
    { name: "Under Review", value: 0, color: "#FFA500" },
    { name: "Closed", value: 0, color: "#E74C3C" }
  ]);

  // Poll status data from backend
  const [pollData, setPollData] = useState([
    { name: "Active", value: 0, color: "#0F4C5C" },
    { name: "Closed", value: 0, color: "#6B7280" }
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
    try {
      console.log("Fetching report data from backend...");
      
      // Fetch all user's petitions/complaints
      let complaints = [];
      try {
        const complaintsResponse = await getMyComplaints({ page: 1, limit: 1000 });
        console.log("Complaints API response:", complaintsResponse);
        complaints = complaintsResponse?.complaints || [];
      } catch (apiError) {
        console.error("Error fetching my complaints:", apiError);
        console.log("Trying to fetch from alternative endpoint...");
        // Fallback: try to get all complaints and filter by user
        try {
          const allComplaintsResponse = await getAllComplaints({ page: 1, limit: 1000 });
          const allComplaints = allComplaintsResponse?.complaints || [];
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const userId = parsedUser._id || parsedUser.id;
            complaints = allComplaints.filter(c => {
              const createdById = c.created_by?._id || c.created_by;
              return createdById === userId;
            });
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      }
      
      console.log("Total complaints fetched:", complaints.length);
      
      // Calculate total petitions
      const totalPetitions = complaints.length;
      
      // Calculate petition status breakdown
      const activeCount = complaints.filter(c => c.status === "pending" || c.status === "in-progress").length;
      const underReviewCount = complaints.filter(c => c.status === "under-review").length;
      const closedCount = complaints.filter(c => c.status === "resolved" || c.status === "closed").length;
      
      console.log("Petition counts:", { activeCount, underReviewCount, closedCount, total: complaints.length });
      
      // Always update petition status data for pie chart
      const newPetitionData = [
        { name: "Active", value: activeCount, color: "#0F4C5C" },
        { name: "Under Review", value: underReviewCount, color: "#FFA500" },
        { name: "Closed", value: closedCount, color: "#E74C3C" }
      ];
      console.log("Setting petition data:", newPetitionData);
      setPetitionData(newPetitionData);
      
      // Fetch polls data - get all polls created by this user
      let totalPolls = 0;
      let userPolls = [];
      
      try {
        const pollsResponse = await getAllPolls({ page: 1, limit: 1000 });
        const allPolls = pollsResponse?.polls || [];
        
        // Filter polls created by current user
        const storedUser = localStorage.getItem("user");
        let userId = null;
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser._id || parsedUser.id;
        }
        
        if (userId) {
          userPolls = allPolls.filter(poll => {
            const createdById = poll.created_by?._id || poll.created_by;
            return createdById === userId;
          });
        }
        
        totalPolls = userPolls.length;
        
        console.log("Poll counts:", { totalPolls, userPolls });
        
        // For now, all polls are considered active since there's no status field
        // You can add logic here if polls have expiry dates or status in the future
        const activePolls = totalPolls;
        const closedPolls = 0;
        
        // Always update poll status data for pie chart
        const newPollData = [
          { name: "Active", value: activePolls, color: "#0F4C5C" },
          { name: "Closed", value: closedPolls, color: "#6B7280" }
        ];
        console.log("Setting poll data:", newPollData);
        setPollData(newPollData);
      } catch (pollError) {
        console.error("Error fetching polls:", pollError);
      }
      
      // Calculate active engagement (active petitions + under review + active polls)
      const activeEngagement = activeCount + underReviewCount + totalPolls;
      
      // Update stats
      setStats({
        totalPetitions: totalPetitions,
        petitionIncrease: totalPetitions > 0 ? `${totalPetitions} total petitions` : "No petitions yet",
        totalPolls: totalPolls,
        pollIncrease: totalPolls > 0 ? `${totalPolls} total polls` : "No polls yet",
        activeEngagement: activeEngagement,
        engagementSubtitle: "Active petitions and polls"
      });
      
    } catch (error) {
      console.error("Error fetching report data:", error);
      console.error("Error details:", error.message);
      
      // Set default data even on error so charts show
      setPetitionData([
        { name: "Active", value: 0, color: "#0F4C5C" },
        { name: "Under Review", value: 0, color: "#FFA500" },
        { name: "Closed", value: 0, color: "#E74C3C" }
      ]);
      
      setPollData([
        { name: "Active", value: 0, color: "#0F4C5C" },
        { name: "Closed", value: 0, color: "#6B7280" }
      ]);
      
      setStats({
        totalPetitions: 0,
        petitionIncrease: "No petitions yet",
        totalPolls: 0,
        pollIncrease: "No polls yet",
        activeEngagement: 0,
        engagementSubtitle: "Create petitions and polls to see data"
      });
    } finally {
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
      csvContent += `Total Petitions,${stats.totalPetitions}\n`;
      csvContent += `Total Polls,${stats.totalPolls}\n`;
      csvContent += `Active Engagement,${stats.activeEngagement}\n\n`;
      
      // Petition Status Breakdown from current state
      csvContent += "PETITION STATUS BREAKDOWN\n";
      csvContent += "Status,Count\n";
      petitionData.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
      csvContent += "\n";
      
      // Poll Status Breakdown from current state
      csvContent += "POLL STATUS BREAKDOWN\n";
      csvContent += "Status,Count\n";
      pollData.forEach(item => {
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
              <div class="stat-label">Total Petitions</div>
              <div class="stat-value">${stats.totalPetitions}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Polls</div>
              <div class="stat-value">${stats.totalPolls}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Active Engagement</div>
              <div class="stat-value">${stats.activeEngagement}</div>
            </div>
          </div>

          <h2>Petition Status Breakdown</h2>
          <div class="breakdown">
            ${petitionData.map(item => `
              <div class="breakdown-item">
                <div class="breakdown-label">${item.name}</div>
                <div class="breakdown-value">${item.value}</div>
              </div>
            `).join('')}
          </div>

          <h2>Poll Status Breakdown</h2>
          <div class="breakdown">
            ${pollData.map(item => `
              <div class="breakdown-item">
                <div class="breakdown-label">${item.name}</div>
                <div class="breakdown-value">${item.value}</div>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>This report was generated automatically from your civic engagement data.</p>
            <p>© ${new Date().getFullYear()} Civic Engagement Platform. All rights reserved.</p>
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
    <Layout userType="citizen">
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
            <h1 className="report-main-title">Reports & Analytics</h1>
            <p className="report-subtitle">
              Track civic engagement and measure the impact of petitions and polls.
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
                  <span className="stat-label">Total Petitions</span>
                  <div className="stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                </div>
                <div className="stat-value">{stats.totalPetitions}</div>
                <div className="stat-trend positive">
                  <TrendingUp size={14} />
                  {stats.petitionIncrease}
                </div>
              </div>

              <div className="report-stat-card">
                <div className="stat-header">
                  <span className="stat-label">Total Polls</span>
                  <div className="stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="20" x2="12" y2="10" />
                      <line x1="18" y1="20" x2="18" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="16" />
                    </svg>
                  </div>
                </div>
                <div className="stat-value">{stats.totalPolls}</div>
                <div className="stat-trend positive">
                  <TrendingUp size={14} />
                  {stats.pollIncrease}
                </div>
              </div>

              <div className="report-stat-card">
                <div className="stat-header">
                  <span className="stat-label">Active Engagement</span>
                </div>
                <div className="stat-value">{stats.activeEngagement}</div>
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
            {/* Petition Status Breakdown */}
            <div className="chart-card">
              <h3 className="chart-title">Petition Status Breakdown</h3>
              <p className="chart-subtitle">Distribution of petitions by current status</p>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={petitionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={CustomLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {petitionData.map((entry, index) => (
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
              </div>
            </div>

            {/* Poll Status Breakdown */}
            <div className="chart-card">
              <h3 className="chart-title">Poll Status Breakdown</h3>
              <p className="chart-subtitle">Distribution of polls by current status</p>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pollData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={CustomLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pollData.map((entry, index) => (
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportDashboard;
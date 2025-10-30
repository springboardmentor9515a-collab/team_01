import { useState, useEffect } from "react";
import "./CitizenDashboard.css";
import "../components/FilterButtons.css";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { getMyComplaints } from "../services/api";
import {
  FileText,
  CheckCircle2,
  BarChart3,
  Plus,
  MapPin,
  Filter,
} from "lucide-react";

const CitizenDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [userName, setUserName] = useState("Citizen");
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPetitions, setTotalPetitions] = useState(0);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "All Categories",
    "Infrastructure", 
    "Sanitation", 
    "Water Supply", 
    "Electricity", 
    "Roads", 
    "Public Safety", 
    "Education", 
    "Healthcare", 
    "Environment", 
    "Transportation", 
    "Safety", 
    "Other"
  ];

  const statusOptions = [
    "All Status",
    "Received",
    "In Review", 
    "Resolved"
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.name) setUserName(parsedUser.name);
        else if (parsedUser.fullName) setUserName(parsedUser.fullName);
        // fetch citizen's petitions
        fetchMyPetitions();
      } catch (err) {
        console.error("Error parsing user:", err);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Refetch when filters change
  useEffect(() => {
    if (userName !== "Citizen") { // Only fetch if user is loaded
      fetchMyPetitions();
    }
  }, [selectedCategory, selectedStatus]);



  const fetchMyPetitions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: 1, limit: 20 };
      
      // Add category filter if not "All Categories"
      if (selectedCategory !== "All Categories") {
        params.category = selectedCategory.toLowerCase().replace(/ /g, '_');
      }
      
      // Add status filter if not "All Status"
      if (selectedStatus !== "All Status") {
        params.status = selectedStatus.toLowerCase().replace(/ /g, '_');
      }
      
      const resp = await getMyComplaints(params);
      const complaints = resp && resp.complaints ? resp.complaints : [];
      const pagination = resp && resp.pagination ? resp.pagination : null;
      setPetitions(complaints);
      if (pagination && typeof pagination.totalRecords === "number") {
        setTotalPetitions(pagination.totalRecords);
      } else {
        setTotalPetitions(complaints.length);
      }
    } catch (err) {
      console.error("Error fetching my petitions:", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const clearFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedStatus("All Status");
  };

  const hasActiveFilters = selectedCategory !== "All Categories" || selectedStatus !== "All Status";

  return (
    <Layout userType="citizen">
      <div className="citizen-page">
        {/* Header */}
        <div className="citizen-header">
          <div>
            <h1 className="citizen-title">Welcome back, {userName} 👋</h1>
            <p className="citizen-subtitle">
              See what's happening in your community and make your voice heard.
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
        <div className="citizen-stats">
          <StatCard
            title="My Petitions"
            value={totalPetitions}
            subtitle="petitions"
            icon={FileText}
            iconColor="bg-[#0F4C5C]/10 text-[#0F4C5C]"
            trend={{ value: "2 new", isPositive: true }}
          />
          <StatCard
            title="Successful Petitions"
            value={petitions.filter((p) => p.status === "resolved").length}
            subtitle="resolved"
            icon={CheckCircle2}
            iconColor="bg-green-100 text-green-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="citizen-quick-actions">
          <Button
            size="lg"
            className="quick-action-btn-primary"
            onClick={() => navigate("/create-petition")}
          >
            <Plus className="quick-action-icon" />
            <div className="quick-action-content">
              <div className="quick-action-title">Create New Petition</div>
              <div className="quick-action-subtitle">
                Start a petition for your community
              </div>
            </div>
          </Button>
        </div>

        {/* Active Petitions */}
        <div className="citizen-active-petitions">
          <div className="citizen-active-petitions-header">
            <div>
              <h2 className="active-petitions-title">
                My Complaints
              </h2>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchMyPetitions()}
              >
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`filter-btn ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="filter-icon" />
                Filters {hasActiveFilters && `(${(selectedCategory !== "All Categories" ? 1 : 0) + (selectedStatus !== "All Status" ? 1 : 0)})`} {showFilters ? '▲' : '▼'}
              </Button>
            </div>
          </div>

          <div className="citizen-category-list">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`category-badge ${
                  selectedCategory === category
                    ? "category-badge-active"
                    : "category-badge-inactive"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Status Filter - Show when filters are toggled */}
          {showFilters && (
            <div className="citizen-status-filter" style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>Filter by Status:</h4>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
              <div className="citizen-category-list">
                {statusOptions.map((status) => (
                  <Badge
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    className={`category-badge ${
                      selectedStatus === status
                        ? "category-badge-active"
                        : "category-badge-inactive"
                    }`}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Petitions Grid */}
        <div className="citizen-petitions-grid">
          {loading ? (
            <p>Loading petitions...</p>
          ) : error ? (
            <div className="empty-petitions">
              <p>Error loading petitions: {error}</p>
              <Button onClick={() => fetchMyPetitions()}>Retry</Button>
            </div>
          ) : petitions.length === 0 ? (
            <p className="empty-petitions">No active petitions available.</p>
          ) : (
            petitions.map((petition, index) => (
              <div
                key={petition._id || index}
                className="petition-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="petition-card-full">
                  <div className="petition-thumb">
                    {petition.photo_url ? (
                      // small thumbnail
                      // eslint-disable-next-line jsx-a11y/img-redundant-alt
                      <img src={petition.photo_url} alt="petition image" />
                    ) : (
                      <div className="no-thumb">No image</div>
                    )}
                  </div>
                  <div className="petition-body">
                    {/* <h4 className="petition-title">{petition.title}</h4> */}
                    <p className="petition-desc">{petition.description}</p>
                    <div className="petition-meta">
                      <span className="meta-item">
                        Category: {petition.category?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className="meta-item">📍 {petition.location}</span>
                      <span className="meta-item">
                        Status: <Badge 
                          variant="outline" 
                          className={`status-badge status-${petition.status}`}
                        >
                          {petition.status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </span>
                      <span className="meta-item">
                        Assigned To: {petition.assigned_to?.name || "Unassigned"}
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Community Insights */}
        <div className="citizen-community-insights">
          <h3 className="community-insights-title">My Impact</h3>
          <div className="community-insights-grid">
            <div className="insight-item">
              <div className="insight-value insight-value-primary">{totalPetitions}</div>
              <div className="insight-label">Total Complaints Submitted</div>
            </div>
            <div className="insight-item">
              <div className="insight-value insight-value-success">{petitions.filter(p => p.status === 'resolved').length}</div>
              <div className="insight-label">Complaints Resolved</div>
            </div>
            <div className="insight-item">
              <div className="insight-value insight-value-teal">{totalPetitions > 0 ? Math.round((petitions.filter(p => p.status === 'resolved').length / totalPetitions) * 100) : 0}%</div>
              <div className="insight-label">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CitizenDashboard;

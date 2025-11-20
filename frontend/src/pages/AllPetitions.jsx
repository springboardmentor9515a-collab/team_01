import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { getAllPublicComplaints } from "../services/api";
import { Filter, MapPin } from "lucide-react";
import "./AllPetitions.css";

const AllPetitions = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedResponses, setExpandedResponses] = useState(new Set());

  const categories = [
    "All Categories", "Infrastructure", "Sanitation", "Water Supply",
    "Electricity", "Roads", "Public Safety", "Education", "Healthcare",
    "Environment", "Transportation", "Safety", "Other"
  ];

  const statusOptions = ["All Status", "Received", "In Review", "Resolved"];

  useEffect(() => {
    fetchAllPetitions();
  }, [selectedCategory, selectedStatus]);

  const fetchAllPetitions = async () => {
    setLoading(true);
    try {
      const params = { page: 1, limit: 50 };
      if (selectedCategory !== "All Categories") {
        params.category = selectedCategory.toLowerCase().replace(/ /g, "_");
      }
      if (selectedStatus !== "All Status") {
        params.status = selectedStatus.toLowerCase().replace(/ /g, "_");
      }

      const resp = await getAllPublicComplaints(params);
      setPetitions(resp?.complaints || []);
    } catch (err) {
      console.error("Error fetching petitions:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedStatus("All Status");
  };

  const hasActiveFilters = selectedCategory !== "All Categories" || selectedStatus !== "All Status";

  const toggleResponse = (petitionId) => {
    const newExpanded = new Set(expandedResponses);
    if (newExpanded.has(petitionId)) {
      newExpanded.delete(petitionId);
    } else {
      newExpanded.add(petitionId);
    }
    setExpandedResponses(newExpanded);
  };

  return (
    <Layout userType="citizen">
      <div className="citizen-page">
        <div className="citizen-header">
          <div>
            <h1 className="citizen-title">Community Petitions</h1>
            <p className="citizen-subtitle">See all active petitions in your community</p>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="filter-icon" />
            Filters {hasActiveFilters && `(${(selectedCategory !== "All Categories" ? 1 : 0) + (selectedStatus !== "All Status" ? 1 : 0)})`}
          </Button>
        </div>

        <div className="citizen-category-list">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`category-badge ${selectedCategory === category ? "category-badge-active" : "category-badge-inactive"}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {showFilters && (
          <div className="citizen-status-filter" style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h4 style={{ color: "#374151", fontSize: "0.9rem", fontWeight: "600", margin: 0 }}>Filter by Status:</h4>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>Clear Filters</Button>
              )}
            </div>
            <div className="citizen-category-list">
              {statusOptions.map((status) => (
                <Badge
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  className={`category-badge ${selectedStatus === status ? "category-badge-active" : "category-badge-inactive"}`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="citizen-petitions-grid">
          {loading ? (
            <p>Loading petitions...</p>
          ) : petitions.length === 0 ? (
            <p className="empty-petitions">No petitions found.</p>
          ) : (
            petitions.map((petition, index) => (
              <div key={petition._id || index} className="petition-item">
                <div className="petition-card-full">
                  {petition.photo_url && (
                    <div className="petition-thumb">
                      <img src={petition.photo_url} alt="petition" />
                    </div>
                  )}
                  <div className="petition-body">
                    <h4 className="petition-title">{petition.title}</h4>
                    <p className="petition-desc">{petition.description}</p>
                    <div className="petition-meta">
                      <span className="meta-item">
                        Category: {petition.category?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                      <span className="meta-item">
                        <MapPin className="w-3 h-3 inline" /> {petition.location}
                      </span>
                      <span className="meta-item">
                        By: {petition.created_by?.name || "Anonymous"}
                      </span>
                      <span className="meta-item">
                        Status: 
                        <Badge variant="outline" className={`status-badge status-${petition.status}`}>
                          {petition.status?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      </span>
                      <span className="meta-item">
                        Assigned To: {petition.assigned_to?.name || "Unassigned"}
                      </span>
                      {petition.official_response && (
                        <div className="official-response-section">
                          <button
                            className="response-toggle-btn"
                            onClick={() => toggleResponse(petition._id)}
                          >
                            📋 Official Response {expandedResponses.has(petition._id) ? '▲' : '▼'}
                          </button>
                          {expandedResponses.has(petition._id) && (
                            <div className="official-response">
                              <div className="response-content">
                                {petition.official_response}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AllPetitions;
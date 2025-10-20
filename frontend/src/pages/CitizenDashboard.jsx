import { useState, useEffect } from "react";
import "./CitizenDashboard.css";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import PetitionCard from "../components/PetitionCard";
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
  const [location, setLocation] = useState("San Diego, CA");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [userName, setUserName] = useState("Citizen");
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPetitions, setTotalPetitions] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categories = ["All Categories"];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.name) setUserName(parsedUser.name);
        else if (parsedUser.fullName) setUserName(parsedUser.fullName);
        if (parsedUser.location) setLocation(parsedUser.location);
        // fetch citizen's petitions
        fetchMyPetitions();
      } catch (err) {
        console.error("Error parsing user:", err);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChangeLocation = () => {
    // toggle inline edit mode
    setLocationInput(location || "");
    setIsEditingLocation(true);
  };

  const saveLocation = () => {
    const newLoc = locationInput && locationInput.trim();
    if (newLoc) {
      setLocation(newLoc);
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.location = newLoc;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
      } catch (e) {
        console.warn("Failed to persist location in localStorage", e);
      }
      fetchMyPetitions();
    }
    setIsEditingLocation(false);
  };

  const cancelEditLocation = () => {
    setIsEditingLocation(false);
    setLocationInput("");
  };

  const fetchMyPetitions = async () => {
    setLoading(true);
    setError(null);
    try {
      // getMyComplaints returns { complaints, pagination }
      const resp = await getMyComplaints({ page: 1, limit: 20 });
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
          <StatCard
            title="Polls Created"
            value="0"
            subtitle="polls"
            icon={BarChart3}
            iconColor="bg-teal-100 text-teal-600"
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

          <Button
            size="lg"
            variant="outline"
            className="quick-action-btn-secondary"
          >
            <BarChart3 className="quick-action-icon" />
            <div className="quick-action-content">
              <div className="quick-action-title">Create New Poll</div>
              <div className="quick-action-subtitle">
                Get community feedback on issues
              </div>
            </div>
          </Button>
        </div>

        {/* Active Petitions */}
        <div className="citizen-active-petitions">
          <div className="citizen-active-petitions-header">
            <div>
              <h2 className="active-petitions-title">
                Active Petitions Near You
              </h2>
              <div className="location-info">
                <MapPin className="location-icon" />
                {isEditingLocation ? (
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <input
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="Enter city"
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #d1d5db",
                      }}
                    />
                    <Button size="sm" onClick={saveLocation}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelEditLocation}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <span>Showing for: {location}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="change-location-btn"
                      onClick={() => handleChangeLocation()}
                    >
                      Change
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchMyPetitions()}
              >
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="filter-btn">
                <Filter className="filter-icon" />
                Filters
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
                      <span className="meta-item">{petition.category}</span>
                      <span className="meta-item">{petition.location}</span>
                      <span className="meta-item">
                        Status: {petition.status}
                      </span>
                      <span className="meta-item">
                        Assigned To:{" "}
                        {petition.assigned_to?.name || "Unassigned"}
                      </span>
                    </div>
                    <div className="petition-actions" style={{ marginTop: 12 }}>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/complaints/${petition._id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Community Insights */}
        <div className="citizen-community-insights">
          <h3 className="community-insights-title">Community Impact</h3>
          <div className="community-insights-grid">
            <div className="insight-item">
              <div className="insight-value insight-value-primary">0</div>
              <div className="insight-label">Total Signatures This Month</div>
            </div>
            <div className="insight-item">
              <div className="insight-value insight-value-success">0</div>
              <div className="insight-label">Petitions Approved</div>
            </div>
            <div className="insight-item">
              <div className="insight-value insight-value-teal">0%</div>
              <div className="insight-label">Community Engagement</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CitizenDashboard;

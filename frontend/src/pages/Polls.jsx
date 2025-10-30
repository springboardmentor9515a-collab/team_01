import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { getAllPolls } from "../services/api";
import { MapPin, User, Calendar, Vote } from "lucide-react";
import "./Polls.css";

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const locations = ["All Locations", ...new Set(polls.map(poll => poll.target_location))];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchPolls();
    }
  }, [user, selectedLocation]);

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: 1, limit: 50 };
      
      if (selectedLocation !== "All Locations") {
        params.target_location = selectedLocation;
      }
      
      const response = await getAllPolls(params);
      setPolls(response.polls || []);
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError(err.message || "Failed to fetch polls");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPoll = (pollId) => {
    navigate(`/polls/${pollId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout userType={user?.role || "citizen"}>
      <div className="polls-container">
        {/* Alert Messages */}
        {error && (
          <div className="alert alert-error">
            {error}
            {error.includes("Backend server") && (
              <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                <strong>To fix this:</strong>
                <br />1. Open terminal in backend folder
                <br />2. Run: <code>npm start</code>
                <br />3. Make sure server runs on port 5000
              </div>
            )}
          </div>
        )}

        {/* Header Section */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Community Polls</h1>
            <p className="page-description">
              Participate in community decision-making and make your voice heard
            </p>
          </div>
        </div>

        {/* Location Filter */}
        <div className="filter-section">
          <h3 className="filter-title">Filter by Location</h3>
          <div className="filter-badges">
            {locations.map((location) => (
              <button
                key={location}
                className={`filter-badge ${selectedLocation === location ? "active" : ""}`}
                onClick={() => setSelectedLocation(location)}
              >
                {location}
              </button>
            ))}
          </div>
        </div>

        {/* Polls Grid */}
        <div className="polls-container-grid">
          {loading ? (
            <div className="state-message">
              <div className="loading-spinner"></div>
              <p>Loading polls...</p>
            </div>
          ) : polls.length === 0 ? (
            <div className="state-message">
              <p>No polls available for the selected location.</p>
            </div>
          ) : (
            polls.map((poll) => (
              <div key={poll._id} className="poll-card-modern">
                <div className="poll-header-section">
                  <h2 className="poll-question">{poll.title}</h2>
                  <div className="poll-metadata">
                    <div className="meta-item">
                      <User size={16} />
                      <span>{poll.created_by?.name || "Anonymous"}</span>
                    </div>
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{poll.target_location}</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{formatDate(poll.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="poll-actions">
                  <div className="poll-stats">
                    <span className="options-count">{poll.options?.length || 0} options</span>
                  </div>
                  <Button 
                    onClick={() => handleViewPoll(poll._id)}
                    className="vote-button"
                  >
                    <Vote size={16} />
                    Vote Now
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Polls;
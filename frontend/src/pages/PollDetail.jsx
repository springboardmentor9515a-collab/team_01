import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { getAllPolls, votePoll, getPollResults } from "../services/api";
import { MapPin, User, Calendar, Vote, ArrowLeft, BarChart3 } from "lucide-react";
import "./PollDetail.css";

const PollDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const layoutUserType = (user?.role === "admin" || user?.role === "official")
    ? "official"
    : (user?.role === "volunteer" ? "volunteer" : "citizen");

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
    if (user && id) {
      fetchPollData();
    }
  }, [user, id]);

  const fetchPollData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get all polls and find the specific one
      const pollsResponse = await getAllPolls({ page: 1, limit: 100 });
      const foundPoll = pollsResponse.polls.find(p => p._id === id);
      
      if (!foundPoll) {
        setError("Poll not found");
        return;
      }
      
      setPoll(foundPoll);
      
      // Try to get results to check if user has voted
      try {
        const resultsResponse = await getPollResults(id);
        setResults(resultsResponse);
      } catch (resultsErr) {
        console.log('Results not available yet');
      }
      
    } catch (err) {
      console.error("Error fetching poll:", err);
      if (err.message.includes("404") || err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError("Backend server is not running. Please start the backend server and try again.");
      } else {
        setError(err.message || "Failed to fetch poll data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (option) => {
    if (hasVoted) return;
    
    setVoting(true);
    setError(null);
    setSuccessMessage("");
    
    try {
      await votePoll(id, option);
      setSuccessMessage(`Your vote for "${option}" has been recorded!`);
      setHasVoted(true);
      
      // Refresh results and show them
      setTimeout(async () => {
        try {
          const resultsResponse = await getPollResults(id);
          setResults(resultsResponse);
          setShowResults(true);
        } catch (err) {
          console.log('Could not fetch updated results');
        }
      }, 1500);
      
    } catch (err) {
      console.error("Error voting:", err);
      if (err.message.includes("already voted")) {
        setError("You have already voted on this poll");
        setHasVoted(true);
      } else {
        setError("Failed to vote. Please try again.");
      }
    } finally {
      setVoting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculatePercentage = (votes, total) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  if (loading) {
    return (
      <Layout userType={layoutUserType}>
        <div className="poll-detail-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading poll...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !poll) {
    return (
      <Layout userType={layoutUserType}>
        <div className="poll-detail-container">
          <div className="error-state">
            <p>Error: {error}</p>
            <Button onClick={() => navigate("/polls")}>
              <ArrowLeft size={16} />
              Back to Polls
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType={layoutUserType}>
      <div className="poll-detail-container">
        {/* Alert Messages */}
        {successMessage && (
          <div className="alert alert-success">
            <Vote size={20} />
            {successMessage}
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="poll-detail-header">
          <Button 
            variant="outline" 
            onClick={() => navigate("/polls")}
            className="back-button"
          >
            <ArrowLeft size={16} />
            Back to Polls
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowResults(!showResults)}
            className="results-toggle"
          >
            <BarChart3 size={16} />
            {showResults ? "Hide Results" : "Show Results"}
          </Button>
        </div>

        {/* Poll Content */}
        <div className="poll-detail-card">
          <div className="poll-header">
            <h1 className="poll-title">{poll?.title}</h1>
            <p className="poll-description">{poll?.description}</p>
            
            <div className="poll-meta">
              <div className="meta-item">
                <User size={16} />
                <span>{poll?.created_by?.name || "Anonymous"}</span>
              </div>
              <div className="meta-item">
                <MapPin size={16} />
                <span>{poll?.target_location}</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>{formatDate(poll?.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Voting Section */}
          {!showResults && (
            <div className="voting-section">
              <h3>Cast Your Vote</h3>
              {hasVoted ? (
                <div className="voted-message">
                  <Vote size={20} />
                  <span>You have already voted on this poll</span>
                </div>
              ) : (
                <div className="voting-options">
                  {poll?.options?.map((option, index) => (
                    <button
                      key={index}
                      className={`vote-option ${voting ? "voting" : ""}`}
                      onClick={() => handleVote(option)}
                      disabled={voting || hasVoted}
                    >
                      {voting ? "Submitting..." : option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Results Section */}
          {showResults && results && (
            <div className="results-section">
              <h3>Poll Results</h3>
              <div className="results-stats">
                <span>Total Votes: {results?.totalVotes || 0}</span>
              </div>
              
              <div className="results-chart">
                {poll?.options?.map((option, index) => {
                  const votes = results?.results?.[option] || 0;
                  const percentage = calculatePercentage(votes, results?.totalVotes || 0);
                  
                  return (
                    <div key={index} className="result-bar">
                      <div className="result-label">
                        <span className="option-name">{option}</span>
                        <span className="vote-count">{votes} votes ({percentage}%)</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PollDetail;
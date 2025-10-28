import React, { useState } from "react";
import "./CreatePoll.css";
import { createPoll } from "../services/api";

const CreatePoll = () => {
  // State for form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetLocation: "",
    createdTime: new Date().toLocaleString(),
  });

  // Vote counts for fixed options
  const [voteCounts, setVoteCounts] = useState({
    yes: 0,
    no: 0,
    maybe: 0,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const pollData = {
      title: formData.title,
      description: formData.description,
      target_location: formData.targetLocation,
      options: ["Yes", "No", "Maybe"]
    };

    try {
      const response = await createPoll(pollData);
      console.log("Poll created:", response);
      alert("Poll created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        targetLocation: "",
        createdTime: new Date().toLocaleString(),
      });
      setVoteCounts({ yes: 0, no: 0, maybe: 0 });
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Failed to create poll. Please try again.");
    }
  };

  // Handle vote increment
  const handleVote = (option) => {
    setVoteCounts((prev) => ({
      ...prev,
      [option]: prev[option] + 1,
    }));
  };
  return (
    <div className="create-poll-root">
      <div className="ellipse ellipse-bg-main" />
      <div className="ellipse ellipse-bg-right" />
      <div className="ellipse ellipse-bg-bottom" />
      <div className="ellipse ellipse-bg-top-left" />
      <div className="ellipse ellipse-bg-bottom-right" />
      <div className="ellipse ellipse-bg-faint-right" />
      <div className="ellipse ellipse-bg-faint-right-blur" />
      <div className="ellipse ellipse-bg-blur" />
      <div className="rect rect-gradient-1" />
      <div className="rect rect-gradient-2" />

      <div className="rect rect-main" />

      {/* Main Content */}
      <div className="create-poll-content">
        <div className="create-poll-title">Create Poll</div>
        <div className="create-poll-subtitle">Take Vote From Other's</div>
        <form className="poll-form" onSubmit={handleSubmit}>
          <label className="poll-label title-label">Title</label>
          <input
            className="poll-input title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter Poll title"
            required
          />

          <label className="poll-label context-label">Description</label>
          <textarea
            className="poll-textarea context"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your Poll"
            required
          />

          <label className="poll-label location-label">Target Location</label>
          <input
            className="poll-input location"
            type="text"
            name="targetLocation"
            value={formData.targetLocation}
            onChange={handleInputChange}
            placeholder="Enter target location"
            required
          />

          <label className="poll-label type-label">Created Time</label>
          <input
            className="poll-input type"
            type="text"
            name="createdTime"
            value={formData.createdTime}
            readOnly
          />

          <label className="poll-label options-title">Vote Options</label>

          {/* Fixed Options with Vote Counts */}
          <div className="poll-options">
            <div className="option-row">
              <div className="option-item" onClick={() => handleVote("yes")}>
                <button type="button" className="vote-btn">
                  Yes
                </button>
                <span className="vote-count">{voteCounts.yes} votes</span>
              </div>
              <div className="option-item" onClick={() => handleVote("no")}>
                <button type="button" className="vote-btn">
                  No
                </button>
                <span className="vote-count">{voteCounts.no} votes</span>
              </div>
              <div className="option-item" onClick={() => handleVote("maybe")}>
                <button type="button" className="vote-btn">
                  Maybe
                </button>
                <span className="vote-count">{voteCounts.maybe} votes</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button className="submit-poll-btn" type="submit">
            Submit Poll
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;

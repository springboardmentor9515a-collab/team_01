import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePoll.css";
import { createPoll } from "../services/api";

const CreatePoll = () => {
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetLocation: "",
    createdTime: new Date().toLocaleString(),
  });

  // State for custom options
  const [options, setOptions] = useState(["", ""]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle option changes
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Add new option
  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  // Remove option
  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty options
    const validOptions = options.filter(option => option.trim() !== "");
    
    if (validOptions.length < 2) {
      alert("Please provide at least 2 options for the poll.");
      return;
    }

    const pollData = {
      title: formData.title,
      description: formData.description,
      target_location: formData.targetLocation,
      options: validOptions
    };

    try {
      const response = await createPoll(pollData);
      console.log("Poll created:", response);
      alert("Poll created successfully!");
      
      // Redirect to polls list as specified in checklist
      navigate("/polls");
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Failed to create poll. Please try again.");
    }
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
        <div className="create-poll-subtitle">Create Custom Poll Options</div>
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

          <label className="poll-label options-title">Poll Options</label>

          {/* Custom Options Input */}
          <div className="poll-options">
            {options.map((option, index) => (
              <div key={index} className="option-input-row">
                <input
                  className="option-input"
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    className="remove-option-btn"
                    onClick={() => removeOption(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            
            {options.length < 6 && (
              <button
                type="button"
                className="add-option-btn"
                onClick={addOption}
              >
                + Add Option
              </button>
            )}
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
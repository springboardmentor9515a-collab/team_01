import React, { useState } from "react";
import "./ForgotPassword.css";
import password1 from "../assets/password1.png";
import logo from "../assets/logo-civix-figma.png";

function ForgotPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handler for form submission
  const handleChangePassword = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Basic validation
    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // TODO: Backend developer should replace this block with API call to change password
    // Example:
    // fetch('/api/change-password', { method: 'POST', body: JSON.stringify({ password }) })
    //   .then(...)
    //   .catch(...)
    console.log("Password changed to:", password);
    setSuccess("Password changed successfully!");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="forgot-password-wrapper">
      {/* Background and decorative shapes */}
      <div className="ellipse1" />
      <div className="ellipse2" />
      <div className="ellipse3" />
      <div className="ellipse4" />
      <div className="rect1" />
      <div className="rect2" />
      <div className="rect3" />
      {/* CIVIX logo */}
      <div className="civix-logo">
        <img src={logo} alt="CIVIX logo" />
      </div>
      {/* Padlock Illustration */}
      <div className="padlock">
        <img src={password1} alt="Padlock" />
      </div>
      {/* Main Form Section */}
      <form className="change-password-form" onSubmit={handleChangePassword}>
        <div className="change-password-title">Change Password</div>
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        {success && (
          <div style={{ color: "green", marginBottom: 10 }}>{success}</div>
        )}
        <div className="input-wrapper">
          <label className="input-label">New Password</label>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️"}
            </span>
          </div>
        </div>
        <div className="input-wrapper">
          <label className="input-label">Confirm Password</label>
          <div className="input-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "👁️" : "👁️"}
            </span>
          </div>
        </div>
        <button className="change-password-btn" type="submit">
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;

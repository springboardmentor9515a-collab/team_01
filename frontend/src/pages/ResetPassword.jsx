import React, { useState } from "react";
import "./Auth.css";

function ResetPassword() {
  const [token, setToken] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Check token validity with backend
  const handleTokenCheck = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}/civix/auth/verify-reset-token/${token}`);
      const data = await response.json();
      if (response.ok) {
        setIsTokenValid(true);
        setMessage("Token is valid. You can reset your password.");
      } else {
        setIsTokenValid(false);
        setMessage(data.error || "Invalid or expired token!");
      }
    } catch (error) {
      setIsTokenValid(false);
      setMessage("Network error. Please try again.");
    }
  };

  // Submit new password to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!isTokenValid) {
      setMessage("Please enter a valid token first!");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/civix/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Password has been reset! You can now log in.");
        setIsTokenValid(false);
        setToken("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.error || "Error resetting password.");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleTokenCheck}>
        <label>Reset Token:</label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          disabled={isTokenValid}
        />
        <button type="submit" disabled={isTokenValid}>Check Token</button>
      </form>
      <form onSubmit={handleSubmit}>
        <label>New Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={!isTokenValid}
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={!isTokenValid}
        />
        <button type="submit" disabled={!isTokenValid}>Reset Password</button>
      </form>
      {message && <p>{message}</p>}
      <a href="/login">Back to Login</a>

    </div>
  );
}

export default ResetPassword;
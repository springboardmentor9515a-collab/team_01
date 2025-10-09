import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use env variable

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const response = await fetch(`${API_BASE_URL}/civix/auth/forgot-password`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email }),
});
      const data = await response.json();
      setMessage(data.message || "If this email exists, a reset link will be sent.");
      navigate("/reset-password");
    } catch (error) {
      setMessage("Error sending reset link. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
        <button type="submit">Send Reset Token</button>
      </form>
      {message && <p>{message}</p>}
      <a href="/login">Back to Login</a>
    </div>
  );
}

export default ForgotPassword;
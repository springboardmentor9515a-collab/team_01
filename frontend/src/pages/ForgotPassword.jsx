import React, { useState } from "react";
import "./auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send email to backend to trigger reset link
    alert("If this email exists, a reset link will be sent.");
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
      <a href="/login">Back to Login</a>
    </div>
  );
}

export default ForgotPassword;
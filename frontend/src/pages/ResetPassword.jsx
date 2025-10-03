import React, { useState } from "react";
import "./Auth.css";
function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Example: Replace this with your actual token validation logic
  const VALID_TOKEN = "123456"; // For demo, use a hardcoded token

  const handleTokenCheck = (e) => {
    e.preventDefault();
    if (token === VALID_TOKEN) {
      setIsTokenValid(true);
      alert("Token is valid. You can reset your password.");
    } else {
      setIsTokenValid(false);
      alert("Invalid token!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isTokenValid) {
      alert("Please enter a valid token first!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // TODO: Send new password and token to backend to reset password
    alert("Password has been reset!");
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
    </div>
  );
}

export default ResetPassword;
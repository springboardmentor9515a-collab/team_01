import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import civixLogo from "../assets/civix-logo.png";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use env variable

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/civix/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message || "If this email exists, a reset link will be sent.");
        setTimeout(() => navigate("/reset-password"), 2000);
      } else {
        setMessage(data.message || "Error sending reset link. Please try again.");
      }
    } catch (error) {
      setMessage("Error sending reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <Link to="/login" className="back-button">
            <ArrowLeft size={20} />
            Back to Login
          </Link>
          <img src={civixLogo} alt="CIVIX" className="logo" />
        </div>
        
        <div className="forgot-password-content">
          <div className="icon-wrapper">
            <Mail size={48} className="mail-icon" />
          </div>
          
          <h1 className="title">Forgot Password?</h1>
          <p className="subtitle">
            No worries! Enter your email address and we'll send you a reset link.
          </p>
          
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="input-group">
                <div className="input-wrapper">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="email-input"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="success-message">
              <CheckCircle size={48} className="success-icon" />
              <h3>Email Sent!</h3>
              <p>Check your inbox for the reset token.</p>
              <p className="redirect-text">Redirecting to reset password page...</p>
            </div>
          )}
          
          {message && !isSuccess && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
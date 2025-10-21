import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Key } from "lucide-react";
import civixLogo from "../assets/civix-logo.png";
import "./ResetPassword.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: token verification, 2: password reset
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Check if token is provided in URL
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      handleTokenCheck(null, urlToken);
    }
  }, [searchParams]);

  // Check token validity with backend
  const handleTokenCheck = async (e, tokenToCheck = token) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/civix/auth/verify-reset-token/${tokenToCheck}`);
      const data = await response.json();
      
      if (response.ok) {
        setIsTokenValid(true);
        setStep(2);
        setMessage("");
      } else {
        setIsTokenValid(false);
        setMessage(data.error || "Invalid or expired token!");
      }
    } catch (error) {
      setIsTokenValid(false);
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit new password to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    if (!isTokenValid) {
      setMessage("Please enter a valid token first!");
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setIsLoading(false);
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
        setIsSuccess(true);
        setMessage("Password has been reset successfully!");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage(data.error || "Error resetting password.");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <Link to="/login" className="back-button">
            <ArrowLeft size={20} />
            Back to Login
          </Link>
          <img src={civixLogo} alt="CIVIX" className="logo" />
        </div>
        
        <div className="reset-password-content">
          {!isSuccess ? (
            <>
              <div className="icon-wrapper">
                {step === 1 ? <Key size={48} className="key-icon" /> : <Lock size={48} className="lock-icon" />}
              </div>
              
              <h1 className="title">
                {step === 1 ? "Verify Reset Token" : "Create New Password"}
              </h1>
              <p className="subtitle">
                {step === 1 
                  ? "Enter the reset token sent to your email address."
                  : "Choose a strong password for your account."
                }
              </p>
              
              {step === 1 ? (
                <form onSubmit={handleTokenCheck} className="reset-form">
                  <div className="input-group">
                    <div className="input-wrapper">
                      <Key size={20} className="input-icon" />
                      <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                        placeholder="Enter reset token"
                        className="token-input"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isLoading || !token.trim()}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Verify Token
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="reset-form">
                  <div className="input-group">
                    <div className="input-wrapper">
                      <Lock size={20} className="input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="New password"
                        className="password-input"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="eye-button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="input-group">
                    <div className="input-wrapper">
                      <Lock size={20} className="input-icon" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm new password"
                        className="password-input"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="eye-button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isLoading || !password.trim() || !confirmPassword.trim()}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner"></div>
                        Resetting...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Reset Password
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="success-message">
              <CheckCircle size={64} className="success-icon" />
              <h2>Password Reset Successful!</h2>
              <p>Your password has been updated successfully.</p>
              <p className="redirect-text">Redirecting to login page...</p>
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

export default ResetPassword;
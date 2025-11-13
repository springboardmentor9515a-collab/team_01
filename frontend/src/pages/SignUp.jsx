import { useState, useRef, useEffect } from 'react';
import { signupUser, isValidRole } from '../services/api.js';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext.jsx';
import civixLogo from '../assets/civix-logo.png';
import communityImg from '../assets/community.png';
import mailIcon from '../assets/mail.svg';
import userIcon from '../assets/user.svg';
import eyeOpenIcon from '../assets/eye-open.svg';
import eyeClosedIcon from '../assets/eye-closed.svg';
import googleIcon from '../assets/google.svg';
import locationIcon from '../assets/location.svg';
import './SignUp.css'; // <-- Import the CSS file

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const togglePasswordVisibility = () => setIsPasswordVisible(v => !v);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(v => !v);

  // Pre-fill form with Google data if available
  useEffect(() => {
    if (location.state?.googleData) {
      const { name, email } = location.state.googleData;
      setFormData(prev => ({ ...prev, name, email }));
      setMessage('Complete your signup with the information from Google');
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignupClick = async () => {
    setMessage('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
      setMessage('Please fill all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (!isValidRole(formData.role)) {
      setMessage('Please select a valid role');
      return;
    }

    setLoading(true);
    try {
      let data;
      
      // Check if this is a Google OAuth signup
      if (location.state?.googleData) {
        // Google OAuth signup
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            googleToken: location.state.googleData.token,
            role: formData.role,
            location: formData.location,
            password: formData.password
          })
        });
        data = await response.json();
        
        if (data.success && data.token) {
          login(data.user, data.token);
          setMessage('Account created successfully!');
          setTimeout(() => navigate('/dashboard'), 1000);
          return;
        }
      } else {
        // Regular email signup
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };
        if (formData.location) payload.location = formData.location;
        if (formData.role) payload.role = formData.role;

        data = await signupUser(payload);
      }
      if (data && (data.message || data.user)) {
        setMessage(data.message || 'Account created successfully!');
        setFormData({ name: '', email: '', password: '', confirmPassword: '', location: '', role: '' });
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch (error) {
      // If validation details are present, show the first message
      if (error.details && Array.isArray(error.details) && error.details.length > 0) {
        setMessage(error.details.map(d => d.msg).join(', '));
      } else {
        setMessage(error.message || 'Network error. Please try again.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setMessage('Processing Google authentication...');
      
      // Try to login first
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleToken: credentialResponse.credential })
      });
      
      const data = await response.json();
      
      if (data.success && data.token) {
        // User exists, login successful
        login(data.user, data.token);
        setMessage('Login successful!');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else if (data.needsProfile || data.needsSignup) {
        // New user, navigate to signup with Google data
        const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
        navigate('/signup', { 
          state: { 
            googleData: {
              token: credentialResponse.credential,
              name: decoded.name,
              email: decoded.email
            }
          }
        });
      } else {
        setMessage(data.error || 'Google authentication failed');
      }
    } catch (error) {
      setMessage('Google authentication failed');
      console.error('Google auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage('Google signup failed');
  };

  return (
    <div className="signup-root">
      {/* Background Ellipse */}
      <div className="signup-ellipse"></div>

      {/* Gradient Bars */}
      <div className="signup-rect1"></div>
      <div className="signup-rect2"></div>

      {/* Panel */}
      <div className="signup-panel"></div>

      {/* Logo + Illustration */}
      <div className="signup-logo" style={{ backgroundImage: `url(${civixLogo})` }}></div>
      <div className="signup-illustration" style={{ backgroundImage: `url(${communityImg})` }}></div>

      {/* Title */}
      <div className="signup-title-wrap">
        <div className="signup-title">Sign-Up</div>
        <div className="signup-subtitle">
          Create Your Civix Account to Join With Us
        </div>
      </div>

      {/* Right Side Form */}
      <div className="signup-form">
        {/* Message */}
        {message && (
          <div className={`signup-message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Name */}
        <div className="signup-field signup-field-name">
          <div className="signup-field-bg"></div>
          <img className="signup-field-icon" src={userIcon} alt="Name" />
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name"
            className="signup-input" />
        </div>

        {/* Email */}
        <div className="signup-field signup-field-email">
          <div className="signup-field-bg"></div>
          <img className="signup-field-icon" src={mailIcon} alt="Email" />
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email ID"
            className="signup-input" />
        </div>

        {/* Passwords */}
        <div className="signup-field signup-field-password">
          <div className="signup-field-bg"></div>
          <img className="signup-field-eye" src={isPasswordVisible ? eyeOpenIcon : eyeClosedIcon} alt="Toggle" onClick={togglePasswordVisibility} />
          <input ref={passwordInputRef} type={isPasswordVisible ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="Password"
            className="signup-input signup-input-password" />
        </div>

        <div className="signup-field signup-field-confirm">
          <div className="signup-field-bg"></div>
          <img className="signup-field-eye" src={isConfirmPasswordVisible ? eyeOpenIcon : eyeClosedIcon} alt="Toggle" onClick={toggleConfirmPasswordVisibility} />
          <input ref={confirmPasswordInputRef} type={isConfirmPasswordVisible ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password"
            className="signup-input signup-input-confirm" />
        </div>

        {/* Role */}
        <div className="signup-field signup-field-role">
          <div className="signup-field-bg"></div>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="signup-input signup-select"
          >
            <option value="">Select Role</option>
            <option value="citizen">Citizen</option>
            <option value="admin">Admin</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>

        {/* Location */}
        <div className="signup-field signup-field-location">
          <div className="signup-field-bg"></div>
          <img className="signup-field-icon" src={locationIcon} alt="Location" />
          <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Location"
            className="signup-input" />
        </div>

        {/* Sign-Up Button */}
        <button type="button" className="signup-btn"
          onClick={!loading ? handleSignupClick : undefined}
          disabled={loading}
        >
          <div className="signup-btn-bg"></div>
          <div className="signup-btn-text">
            {loading ? 'Signing Up...' : 'Sign-Up'}
          </div>
        </button>

        {/* Alternative text */}
        <div className="signup-alt">
          Alternative Sign-up Method
        </div>

        {/* Social Icons */}
        <button className="signup-social-btn signup-social-google"
          onClick={() => {
            const googleLoginDiv = document.querySelector('.hidden-google-signup');
            if (googleLoginDiv) {
              googleLoginDiv.querySelector('div[role="button"]')?.click();
            }
          }}>
          <img src={googleIcon} alt="Google" className="signup-social-img" />
          <span className="signup-social-text">Google</span>
        </button>
        
        <div className="hidden-google-signup" style={{ display: 'none' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>
      </div>

      {/* Already have account */}
      <div className="signup-already">
        <span className="signup-already-text">Already have an account </span>
        <Link to="/login" className="signup-already-link">Log-in</Link>
      </div>
    </div>
  );
}
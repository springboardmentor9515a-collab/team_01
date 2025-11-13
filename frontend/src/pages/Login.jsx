import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { loginUser } from '../services/api.js';
import { GoogleLogin } from '@react-oauth/google';
import communityImg from "../assets/community2-removebg-preview.png";
import googleIcon from "../assets/google.svg";
import eyeOpenIcon from "../assets/eye-open.svg";
import eyeClosedIcon from "../assets/eye-closed.svg";
import mailIcon from "../assets/mail.svg";
import civixLogo from "../assets/civix-logo.png";
import './Login.css'; // <-- Import the CSS file

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const emailInputRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setMessage('');
    
    if (!formData.email || !formData.password) {
      setMessage('Please fill all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const data = await loginUser({ email: formData.email, password: formData.password });
      if (data && data.token) {
        login(data.user, data.token);
        setMessage('Login successful!');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setMessage(data.message || data.error || 'Login failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setMessage('Logging in with Google...');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleToken: credentialResponse.credential
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.token) {
        login(data.user, data.token);
        setMessage('Google login successful!');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else if (data.needsSignup) {
        setMessage('Account not found. Please sign up first.');
        setTimeout(() => navigate('/signup'), 2000);
      } else {
        setMessage(data.message || 'Google login failed');
      }
    } catch (error) {
      setMessage('Google login failed');
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage('Google login failed');
  };

  return (
    <div className="login-root">
      {/* Ellipse 1 */}
      {/* <div className="ellipse1"></div> */}

      {/* Rectangle 1 */}
      <div
        className="rectangle1"
        style={{
          background:
            "linear-gradient(182.37deg, #64B3AD 5.78%, #407470 38.95%, #2B4D4A 94.22%)",
        }}
      ></div>

      {/* Rectangle 2 */}
      <div
        className="rectangle2"
        style={{ background: "linear-gradient(178.33deg, #33556E 0.26%, #64B3AD 84.92%)" }}
      ></div>

      {/* Ellipse 4 */}
      <div
        className="ellipse4"
        style={{
          background: "linear-gradient(180deg, #4BA49C 0%, #64B3AC 100%)",
          filter: "blur(40px)",
        }}
      ></div>

      {/* Rectangle 3 - main panel */}
      <div
        className="main-panel"
        style={{ boxShadow: "0px 4px 50px 15px rgba(0,0,0,0.25)" }}
      ></div>

      {/* CIVIX Logo */}
      <div
        className="civix-logo"
        style={{
          backgroundImage: `url(${civixLogo})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>

      {/* community2 image */}
      <div
        className="community-img"
        style={{
          backgroundImage: `url(${communityImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.32,
        }}
      ></div>

      {/* Welcome Back */}
      <div
        className="welcome-back"
        style={{ fontFamily: '"Baskerville Old Face", serif' }}
      >
        <span className="welcome-back-text">Welcome Back !</span>
      </div>

      {/* Subheading */}
      <div
        className="subheading"
        style={{ fontFamily: '"Baumans", cursive' }}
      >
        <span className="subheading-text">
          Log in to make your voice heard in your community.
        </span>
      </div>

      {/* Log-in title */}
      <div
        className="login-title"
        style={{ fontFamily: '"Jacques Francois", serif' }}
      >
        <span className="login-title-text">Log-in</span>
      </div>

      {/* Email */}
      <div className="login-field login-field-email">
        <div className="login-field-bg"></div>
        <img className="login-field-icon" src={mailIcon} alt="Email" />
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleInputChange} 
          placeholder="Email ID" 
          className="login-input"
          ref={emailInputRef}
        />
      </div>

      {/* Password */}
      <div className="login-field login-field-password">
        <div className="login-field-bg"></div>
        <img 
          className="login-field-eye" 
          src={showPassword ? eyeOpenIcon : eyeClosedIcon} 
          alt="Toggle" 
          onClick={() => setShowPassword((v) => !v)} 
        />
        <input 
          type={showPassword ? 'text' : 'password'} 
          name="password" 
          value={formData.password} 
          onChange={handleInputChange} 
          placeholder="Password" 
          className="login-input login-input-password" 
        />
      </div>

      {/* ✅ Forgot Password Link */}
      <Link
        to="/forgot-password"
        className="forgot-password-link"
        style={{ fontFamily: '"Copperplate Gothic Light", serif' }}
        aria-label="Forgot Password"
      >
        <span className="forgot-password-text" style={{ color: '#000000' }}>
          Forgot Password ?
        </span>
      </Link>

      {/* Message Display */}
      {message && (
        <div 
          className="message-display"
          style={{ 
            fontFamily: 'Perpetua, serif',
            fontSize: '14px',
            color: message.includes('successful') ? '#2B4D4A' : '#d32f2f'
          }}
        >
          {message}
        </div>
      )}

      {/* Log-in button */}
      <button
        type="button"
        className="login-btn"
        style={{ fontFamily: '"Jacques Francois", serif' }}
        onClick={!loading ? handleLogin : undefined}
        disabled={loading}
      >
        <span className="login-btn-text">
          {loading ? 'Logging in...' : 'Log-in'}
        </span>
      </button>

      {/* Divider */}
      <div className="divider"></div>

      {/* Alternative Login Text */}
      <div className="alternative-login">
        <span className="alternative-login-text">Alternative Login Method</span>
      </div>

      {/* Social buttons */}
      <button
        type="button"
        className="social-btn google-btn"
        aria-label="Continue with Google"
        onClick={() => {
          const googleLoginDiv = document.querySelector('.hidden-google-login');
          if (googleLoginDiv) {
            googleLoginDiv.querySelector('div[role="button"]')?.click();
          }
        }}
      >
        <img src={googleIcon} alt="Google" className="social-btn-img" />
        <span className="social-btn-text">Google</span>
      </button>
      
      <div className="hidden-google-login" style={{ display: 'none' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </div>


      {/* Create account */}
      <div
        className="create-account"
        style={{ fontFamily: '"Protest Strike", sans-serif' }}
      >
        <span className="create-account-text">New to CIVIX?&nbsp;</span>
        <Link
          to="/signup"
          className="create-account-link"
          aria-label="Create an Account"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
}
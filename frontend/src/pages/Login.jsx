import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import communityImg from "../assets/community2-removebg-preview.png";
import twitterIcon from "../assets/twitter.svg";
import googleIcon from "../assets/google.svg";
import facebookIcon from "../assets/facebook.svg";
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
      // const response = await fetch('http://localhost:5000/civix/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/civix/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Login successful!');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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

      {/* Email input */}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
        className="email-input"
        style={{ color: '#000000', fontFamily: '"Phetsarath OT", "Phetsarath", sans-serif', textIndent: '4px' }}
        ref={emailInputRef}
      />

      {/* Email icon (focus email) */}
      <button
        type="button"
        className="email-icon-btn"
        aria-label="Focus email field"
        onClick={() => emailInputRef.current && emailInputRef.current.focus()}
      >
        <img src={mailIcon} alt="" aria-hidden="true" className="email-icon-img" />
      </button>

      {/* Password input */}
      <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Password"
        className="password-input"
        style={{ color: '#000000', fontFamily: '"Phetsarath OT", "Phetsarath", sans-serif' }}
      />

      {/* Password visibility toggle */}
      <button
        type="button"
        className="password-toggle-btn"
        aria-label="Toggle password visibility"
        aria-pressed={showPassword}
        onClick={() => setShowPassword((v) => !v)}
      >
        <img src={showPassword ? eyeOpenIcon : eyeClosedIcon} alt="toggle password" className="password-toggle-img" />
      </button>

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

      {/* Social buttons */}
      <button
        type="button"
        className="social-btn google-btn"
        aria-label="Continue with Google"
      >
        <img src={googleIcon} alt="Google" className="social-btn-img" />
      </button>
      <button
        type="button"
        className="social-btn facebook-btn"
        aria-label="Continue with Facebook"
      >
        <img src={facebookIcon} alt="Facebook" className="social-btn-img" />
      </button>
      <button
        type="button"
        className="social-btn twitter-btn"
        aria-label="Continue with Twitter"
      >
        <img src={twitterIcon} alt="Twitter" className="social-btn-img" />
      </button>

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
import React from "react";
import "./LandingPage.css";
import logoCivix from "../assets/logo-civix.png";
import categorized from "../assets/categorized.jpg";
import location from "../assets/location.jpg";
import pollTick from "../assets/poll-tick.jpg";
import signVote from "../assets/vote2.png";
import userPfp from "../assets/user-pfp.jpg";
import notificationIcon from "../assets/notification-icon.jpg";
// iconEnvelope asset is missing, so use a fallback icon (emoji) instead
const iconEnvelope = null;

const LandingPage = () => {
  return (
    <div className="landing-root">
      <div className="ellipse ellipse2"></div>

      <div className="vector-blur"></div>
      <div className="rectangle-blur"></div>

      {/* NAVBAR (Figma order) */}
      <header className="landing-header">
        <div className="navbar-left">
        <div className="navbar-center">
          <img src={logoCivix} alt="Civix Logo" className="navbar-logo" />
        </div>
          
        </div>
        <div className="navbar-right">
          
          
          <button className="login-btn2">Log-in</button>
          <button className="signup-btn2">Sign-Up</button>
        </div>
      </header>

      {/* HERO SECTION (Figma order) */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Shape Your Community Make Your Voice Heard
          </h1>
          <p className="hero-subtitle">
            Create petitions, vote in polls and hold officials accountable - all
            in one platform
          </p>

          <div className="hero-description">
            Engage with local governance through petitions, polls, and direct
            communication with officials. Make your voice heard and track real
            change in your community.
          </div>
        </div>
        <div className="hero-image-wrap">
          <img src={signVote} alt="Vote Illustration" className="hero-image" />
        </div>
        
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="how-cards">
          <div className="how-card">
            <div className="how-img">
              <img src={userPfp} alt="Create Petition" />
            </div>
            <div className="how-title">Create a Petition</div>
            <div className="how-desc">
              Raise your voice by creating a petition about issues that matter
              in your community.
            </div>
          </div>
          <div className="how-card">
            <div className="how-img">
              <img src={signVote} alt="Sign & Vote" />
            </div>
            <div className="how-title">Sign & Vote</div>
            <div className="how-desc">
              Show your support by signing petitions and participating in
              community polls.
            </div>
          </div>
          <div className="how-card">
            <div className="how-img">
              <img src={notificationIcon} alt="Track Responses" />
            </div>
            <div className="how-title">Track Responses</div>
            <div className="how-desc">
              Follow the progress and see how officials respond to your
              community’s concerns.
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <h2>Features</h2>
        <div className="features-cards">
          <div className="feature-card">
            <img src={pollTick} alt="Public sentiment polls" />
            <div className="feature-title">Public sentiment polls</div>
          </div>
          <div className="feature-card">
            <img src={location} alt="Geo-targeted petitions" />
            <div className="feature-title">Geo-targeted petitions</div>
          </div>
          <div className="feature-card">
            <img src={categorized} alt="Categorized Petitions" />
            <div className="feature-title">
              Categorized Petitions (Environment, Safety, Education etc.)
            </div>
          </div>
          <div className="feature-card">
            <img
              src={notificationIcon}
              alt="Transparency & Accountability Report"
            />
            <div className="feature-title">
              Transparency & Accountability Report
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-title">Active Petitions</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Signatures</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Officials Engaged</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Response Rate</div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="success-stories">
        <h2>Success Stories</h2>
        <div className="success-stories-boxes">
          <div>
            <div className="success-story-box"></div>
            <button className="success-story-readmore">Read more</button>
          </div>
          <div>
            <div className="success-story-box1"></div>
            <button className="success-story-readmore1">Read more</button>
          </div>
        </div>
      </section>

      {/* FOOTER (Figma order) */}
      <footer className="landing-footer">
        <div className="footer-left">
          <img src={logoCivix} alt="Civix Logo" className="footer-logo" />
          <div className="footer-desc">
            Empowering citizens to engage with local governance through digital
            tools for petitions, polls, and direct communication with elected
            officials.
          </div>
          <div className="footer-social">
            <button className="icon facebook" onClick={() => window.open('https://facebook.com', '_blank')} aria-label="Facebook"></button>
            <button className="icon twitter" onClick={() => window.open('https://twitter.com', '_blank')} aria-label="Twitter"></button>
            <button className="icon linkedin" onClick={() => window.open('https://linkedin.com', '_blank')} aria-label="LinkedIn"></button>
            <button className="icon youtube" onClick={() => window.open('https://youtube.com', '_blank')} aria-label="YouTube"></button>
          </div>
        </div>
        <div className="footer-center">
          <div className="footer-section">
           
          </div>
          <div className="footer-section">
            <div className="footer-title">Resources</div>
            <nav className="footer-links" aria-label="Resources">
              <ul>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#success-stories">Success Stories</a></li>
                <li><a href="#civic-guide">Civic Guide</a></li>
                <li><a href="#api-docs">API Documentation</a></li>
                <li><a href="#support">Support Center</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </nav>
          </div>
          <div className="footer-section">
            <div className="footer-title">Stay Connected</div>
            <div className="footer-links">
              Get updates on civic engagement opportunities in your area.
            </div>
            <div className="subscribe-row">
              <input
                type="text"
                placeholder="Your email"
                className="subscribe-input"
              />
              <button className="subscribe-btn">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="footer-right">
          
        </div>
        <div className="footer-bottom">
          <span>© 2025 Civix. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
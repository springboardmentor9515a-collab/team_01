import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Vote, MessageSquare, Users, Shield, ArrowRight, CheckCircle } from "lucide-react";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MessageSquare size={32} />,
      title: "File Complaints",
      description: "Report civic issues and track their resolution progress in real-time."
    },
    {
      icon: <Vote size={32} />,
      title: "Community Polls",
      description: "Participate in local decision-making through democratic voting."
    },
    {
      icon: <Users size={32} />,
      title: "Community Engagement",
      description: "Connect with fellow citizens and local officials for better governance."
    }
  ];

  const roles = [
    {
      title: "Citizens",
      description: "File complaints, vote on polls, track issue resolution",
      benefits: ["Report civic issues", "Vote on community matters", "Track complaint status"]
    },
    {
      title: "Officials",
      description: "Create polls, manage community feedback, engage with citizens",
      benefits: ["Create community polls", "View citizen feedback", "Make data-driven decisions"]
    },
    {
      title: "Volunteers",
      description: "Help resolve complaints, assist in community management",
      benefits: ["Manage assigned complaints", "Update resolution status", "Support community"]
    }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <div className="logo">
            <img src="/assets/civix-logo.png" alt="Civix" className="logo-img" />
            <span className="logo-text">Civix</span>
          </div>
          <nav className="nav-buttons">
            <Button variant="outline" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Empowering Communities Through
              <span className="highlight"> Digital Governance</span>
            </h1>
            <p className="hero-description">
              Connect with your local government, report issues, participate in community decisions, 
              and help build a better tomorrow for everyone.
            </p>
            <div className="hero-buttons">
              <Button size="lg" onClick={() => navigate("/signup")}>
                Get Started
                <ArrowRight size={20} />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </div>
          </div>
          <div className="hero-image">
            <img src="/assets/community.png" alt="Community" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="roles">
        <div className="container">
          <h2 className="section-title">Built for Everyone</h2>
          <div className="roles-grid">
            {roles.map((role, index) => (
              <div key={index} className="role-card">
                <h3 className="role-title">{role.title}</h3>
                <p className="role-description">{role.description}</p>
                <ul className="role-benefits">
                  {role.benefits.map((benefit, i) => (
                    <li key={i} className="benefit-item">
                      <CheckCircle size={16} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Make a Difference?</h2>
            <p className="cta-description">
              Join thousands of citizens working together to build stronger communities.
            </p>
            <Button size="lg" onClick={() => navigate("/signup")}>
              Join Civix Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src="/assets/civix-logo.png" alt="Civix" className="logo-img" />
              <span className="logo-text">Civix</span>
            </div>
            <p className="footer-text">
              Empowering communities through digital governance and civic engagement.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  UserCheck,
} from "lucide-react";
import logoCivix from "../assets/logo-civix.png";
import "./UserInfo.css";

function UserInfo() {
  const [userInfo, setUserInfo] = React.useState({
    name: "",
    email: "",
    contact: "",
    age: "",
    role: "",
    location: "",
    idVerification: "",
  });
  const navigate = useNavigate();

  // Load user details from localStorage
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const data = JSON.parse(storedUser);
        setUserInfo({
          name: data.name || data.fullName || "",
          email: data.email || "",
          contact: data.contact || data.phone || "",
          age: data.age ? String(data.age) : "",
          role: data.role || "citizen",
          location: data.location || "",
          idVerification: data.idVerification || "",
        });
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const getInitials = (name) => {
    return (
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "ui-badge-admin";
      case "volunteer":
        return "ui-badge-volunteer";
      default:
        return "ui-badge-citizen";
    }
  };

  const getVerificationBadgeClass = (verification) => {
    return verification && verification !== "Not Verified"
      ? "ui-badge-verified"
      : "ui-badge-unverified";
  };

  const fields = [
    { key: "name", label: "Full Name", value: userInfo.name, icon: User },
    { key: "email", label: "Email Address", value: userInfo.email, icon: Mail },
    {
      key: "contact",
      label: "Phone Number",
      value: userInfo.contact,
      icon: Phone,
    },
    {
      key: "location",
      label: "Location",
      value: userInfo.location,
      icon: MapPin,
    },
    { key: "age", label: "Age", value: userInfo.age, icon: Calendar },
    {
      key: "role",
      label: "Role",
      value: userInfo.role,
      icon: Shield,
      isBadge: true,
      badgeClass: getRoleBadgeClass(userInfo.role),
    },
    {
      key: "idVerification",
      label: "Verification Status",
      value: userInfo.idVerification || "Not Verified",
      icon: UserCheck,
      isBadge: true,
      badgeClass: getVerificationBadgeClass(userInfo.idVerification),
    },
  ].filter((field) => field.value && field.value.trim() !== "");

  return (
    <div className="ui-root">
      <header className="ui-topbar">
        <div className="ui-topbar-inner">
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <img className="ui-logo" src={logoCivix} alt="CIVIX" />
        </div>
      </header>

      <main className="ui-main">
        <div className="ui-card">
          <div className="ui-header">
            <div className="ui-avatar">{getInitials(userInfo.name)}</div>
            <h1 className="ui-title">{userInfo.name || "User"}</h1>
            <p className="ui-subtitle">{userInfo.role || "Citizen"}</p>
          </div>

          <div className="ui-content">
            {fields.map((field) => {
              const IconComponent = field.icon;
              return (
                <div key={field.key} className="ui-field">
                  <div className="ui-field-icon">
                    <IconComponent size={20} color="white" />
                  </div>
                  <div className="ui-field-content">
                    <p className="ui-field-label">{field.label}</p>
                    {field.isBadge ? (
                      <span className={`ui-badge ${field.badgeClass}`}>
                        {field.value}
                      </span>
                    ) : (
                      <p className="ui-field-value">{field.value}</p>
                    )}
                  </div>
                </div>
              );
            })}

            {fields.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#6B7280",
                }}
              >
                <User
                  size={48}
                  style={{ margin: "0 auto 1rem", opacity: 0.5 }}
                />
                <p>No user information available</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserInfo;

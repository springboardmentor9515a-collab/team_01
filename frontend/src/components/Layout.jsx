import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  Settings,
  Home,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import civixLogo from "@/assets/civix-logo.png";
import "./Layout.css";

const Layout = ({ children, userType }) => {
  const location = useLocation();
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("");
  const [userInitials, setUserInitials] = useState("U");

  // Navigation items based on user type
  const citizenNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/citizen" },
    { icon: FileText, label: "Petitions", path: "/petitions" },
    { icon: BarChart3, label: "Polls", path: "/polls" },
    { icon: TrendingUp, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const officialNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/official" },
    { icon: FileText, label: "Review Petitions", path: "/review" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: TrendingUp, label: "Insights", path: "/insights" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const volunteerNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/volunteer" },
    { icon: FileText, label: "Projects", path: "/projects" },
    { icon: Users, label: "Teams", path: "/teams" },
    { icon: QrCode, label: "Volunteer Code", path: "/volunteer-code" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const navItems =
    userType === "official"
      ? officialNavItems
      : userType === "volunteer"
      ? volunteerNavItems
      : citizenNavItems;

  // Load user info dynamically from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const name = parsedUser.name || parsedUser.fullName || "User";
        setUserName(name);
        setUserInitials(name.charAt(0).toUpperCase());
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }

    // Set role based on userType
    const roles = {
      official: "City Official",
      volunteer: "Volunteer",
      citizen: "Verified Citizen",
    };
    setUserRole(roles[userType] || "User");
  }, [userType]);

  return (
    <div
      className="flex min-h-screen w-full 
      bg-gradient-to-br from-[#E3F2F9] via-[#F0F7F4] to-[#DCEEF4]"
    >
      {/* Sidebar */}
      <aside
        className={`app-sidebar ${userType === "citizen" ? "w-48" : "w-64"}`}
      >
        {/* Logo */}
        <div className="sidebar-logo border-b">
          <img src={civixLogo} alt="Civix Logo" className="logo-img" />
          <p className="sidebar-title">
            {userType === "official"
              ? "Official Portal"
              : userType === "volunteer"
              ? "Volunteer Portal"
              : "Citizen Portal"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "nav-item",
                  isActive ? "nav-active" : "nav-inactive"
                )}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="user-card">
            <div className="avatar">{userInitials}</div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{userName}</p>
              <p className="sidebar-user-role">{userRole}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="page-container">{children}</div>
      </main>
    </div>
  );
};

export default Layout;

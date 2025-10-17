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
  QrCode
} from "lucide-react";
import { cn } from "@/lib/utils";
import civixLogo from "@/assets/civix-logo.png";

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
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-md">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex flex-col items-center">
          <img
            src={civixLogo}
            alt="Civix Logo"
            className="h-20 w-auto mb-3 object-contain drop-shadow-md"
          />
          <p className="text-sm font-semibold text-[#0F4C5C] tracking-wide">
            {userType === "official"
              ? "Official Portal"
              : userType === "volunteer"
              ? "Volunteer Portal"
              : "Citizen Portal"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium",
                  isActive
                    ? "bg-[#0F4C5C] text-white shadow-md"
                    : "text-[#0F4C5C] hover:bg-[#DCEEF4] hover:text-[#0F4C5C] hover:shadow-sm"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#E3F2F9] hover:bg-[#DCEEF4] transition">
            <div className="w-10 h-10 rounded-full bg-[#0F4C5C] flex items-center justify-center text-white font-semibold shadow">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-[#0F4C5C]">
                {userName}
              </p>
              <p className="text-xs text-gray-500 truncate">{userRole}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default Layout;

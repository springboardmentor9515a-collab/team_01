import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Settings,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  userType: "official" | "citizen";
}

const Layout = ({ children, userType }: LayoutProps) => {
  const location = useLocation();

  const citizenNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/citizen" },
    { icon: FileText, label: "Petitions", path: "/petitions" },
    { icon: BarChart3, label: "Polls", path: "/polls" },
    { icon: Users, label: "Officials", path: "/officials" },
    { icon: TrendingUp, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const officialNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/official" },
    { icon: FileText, label: "Review Petitions", path: "/review" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: TrendingUp, label: "Insights", path: "/insights" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const navItems = userType === "official" ? officialNavItems : citizenNavItems;

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            CivicHub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {userType === "official" ? "Official Portal" : "Citizen Portal"}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              {userType === "official" ? "A" : "J"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {userType === "official" ? "Admin User" : "John Doe"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userType === "official" ? "City Official" : "Verified Citizen"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;

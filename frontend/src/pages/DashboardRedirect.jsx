import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardRedirect() {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // wait until auth initialized

    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    const role = user?.role;

    switch (role) {
      case "citizen":
        navigate("/dashboard/citizen", { replace: true });
        break;
      case "volunteer":
        navigate("/dashboard/volunteer", { replace: true });
        break;
      case "admin":
      case "official":
        navigate("/dashboard/official", { replace: true });
        break;
      default:
        // fallback to login if role unknown
        navigate("/login", { replace: true });
        break;
    }
  }, [user, loading, isAuthenticated, navigate]);

  return <div>Redirecting to your dashboard...</div>;
}

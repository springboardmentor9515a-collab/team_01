import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import CitizenDashboard from "./pages/CitizenDashboard.jsx";
import VolunteerDashboard from "./pages/VolunteerDashboard.jsx";
import OfficialDashboard from "./pages/OfficialDashboard.jsx";
import DashboardRedirect from "./pages/DashboardRedirect.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import CreatePetition from "./pages/CreatePetition.jsx";
import UserInfo from "./pages/UserInfo.jsx";
import CreatePoll from "./pages/CreatePoll.jsx";

export default function App() {
  return (
    <AuthProvider>
      <div>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />
          {/* Role-specific dashboards */}
          <Route
            path="/dashboard/citizen"
            element={
              <ProtectedRoute allowedRoles={["citizen"]}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/volunteer"
            element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/official"
            element={
              <ProtectedRoute allowedRoles={["admin", "official"]}>
                <OfficialDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-petition"
            element={
              <ProtectedRoute>
                <CreatePetition />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-info"
            element={
              <ProtectedRoute>
                <UserInfo />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route
            path="/create-poll"
            element={
              <ProtectedRoute allowedRoles={["admin", "official"]}>
                <CreatePoll />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

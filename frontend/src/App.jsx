import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx"; // ✅ import
import ResetPassword from "./pages/ResetPassword.jsx";

export default function App() {
  return (
   
  <div>
      <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} /> 
       {/* ✅ route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>

  </div>
  );
}

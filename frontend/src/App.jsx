import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

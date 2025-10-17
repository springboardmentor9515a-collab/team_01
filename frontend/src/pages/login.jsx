import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "citizen") navigate("/citizen");
      else if (res.data.role === "official") navigate("/official");
      else if (res.data.role === "volunteer") navigate("/volunteer");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", borderRadius: "8px" }}
      />
      <br />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", borderRadius: "8px", marginTop: "10px" }}
      />
      <br />
      {message && <div style={{ color: "red", marginTop: "10px" }}>{message}</div>}
      <br />
      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          borderRadius: "8px",
          backgroundColor: "#407470",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Log In
      </button>
    </div>
  );
}

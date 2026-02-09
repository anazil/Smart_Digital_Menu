import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import "../AuthPage.css";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Step 1: Login (get token)
      const res = await axios.post(`${API_BASE_URL}/api/auth/login/`, formData);
      localStorage.setItem("token", res.data.token);

      // Step 2: Get profile (to find user ID)
      const profileRes = await axios.get(`${API_BASE_URL}/api/auth/profile/`, {
        headers: {
          Authorization: `Token ${res.data.token}`,
        },
      });

      const userId = profileRes.data.id;
      localStorage.setItem("userId", userId);

      alert("Login successful!");
      
      // Step 3: Redirect to dashboard with userId
      window.location.href = `/dash/${userId}`;
    } catch (error) {
      alert("Login failed. Check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your cliqeat account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <a href="/signup">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

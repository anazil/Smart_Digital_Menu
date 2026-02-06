import React, { useState } from 'react';
import '../AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    restaurantName: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Login data:', { email: formData.email, password: formData.password });
      // Handle login logic
    } else {
      console.log('Signup data:', formData);
      // Handle signup logic
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1>MenuFlow</h1>
          <p>{isLogin ? 'Welcome back to your restaurant dashboard' : 'Start your digital restaurant journey'}</p>
        </div>

        {/* Toggle Switch */}
        <div className="auth-toggle">
          <button 
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Restaurant Name</label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  placeholder="Enter your restaurant name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {isLogin && (
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#forgot" className="forgot-password">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? 'Login to Dashboard' : 'Create Account'}
          </button>
        </form>

        {/* Social Login */}
        <div className="social-login">
          <div className="divider">
            <span>Or continue with</span>
          </div>
          <div className="social-buttons">
            <button className="social-btn google-btn">
              <span>Google</span>
            </button>
            <button className="social-btn facebook-btn">
              <span>Facebook</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          {isLogin ? (
            <p>Don't have an account? <span onClick={() => setIsLogin(false)}>Sign up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setIsLogin(true)}>Login</span></p>
          )}
        </div>
      </div>

      {/* Demo Credentials Banner */}
      <div className="demo-banner">
        <p><strong>Demo Credentials:</strong> admin@example.com / password123</p>
      </div>
    </div>
  );
};

export default AuthPage;
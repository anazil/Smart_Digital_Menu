import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import '../LandingPage.css';

const LandingPage = () => {
  const features = [
    {
      icon: "📱",
      title: "QR Code Menu",
      description: "Customers scan QR code to access digital menu instantly"
    },
    {
      icon: "⚡",
      title: "Instant Ordering",
      description: "No waiting for waiters, direct kitchen communication"
    },
    {
      icon: "👨‍🍳",
      title: "Kitchen Display",
      description: "Real-time order updates and management for kitchen staff"
    },
    {
      icon: "📊",
      title: "Live Order Tracking",
      description: "Customers track order status in real-time"
    },
    {
      icon: "💳",
      title: "Digital Payments",
      description: "Secure in-app payments and billing"
    },
    {
      icon: "📈",
      title: "Analytics Dashboard",
      description: "Track sales, popular items, and customer behavior"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Scan QR Code",
      description: "Customer scans table QR code with their smartphone"
    },
    {
      step: "2",
      title: "Browse & Order",
      description: "View digital menu, select items, and place order directly"
    },
    {
      step: "3",
      title: "Kitchen Receives",
      description: "Order instantly appears on kitchen display system"
    },
    {
      step: "4",
      title: "Track & Serve",
      description: "Customer tracks order status, kitchen updates progress"
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Restaurant Owner",
      content: "Increased our table turnover by 40% and reduced ordering errors to zero!"
    },
    {
      name: "Priya Sharma",
      role: "Head Chef",
      content: "The kitchen display system makes order management so efficient. Love it!"
    },
    {
      name: "Customer Review",
      role: "Regular Diner",
      content: "No more waiting for the bill! The QR ordering system is so convenient."
    }
  ];

  return (
    <div className="landing-page">
      {/* Header Section */}
      <header className="header">
  <nav className="navbar">
    <div className="nav-brand">
      <h2>Cliqeat</h2>
    </div>
    <ul className="nav-links">
      <li><a href="#features">Features</a></li>
      <li><a href="#how-it-works">How It Works</a></li>
      <li><a href="#testimonials">Testimonials</a></li>
      <li><button className="cta-button nav-cta">Get Started</button></li>
    </ul>
  </nav>
</header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Revolutionize Your Restaurant Experience</h1>
          <p>Digital menu, contactless ordering, and seamless kitchen management - all in one smart solution</p>
          <div className="hero-buttons">
            <Link to="/signup"><button className="btn-primary">Lets Go</button></Link>
            <button className="btn-secondary">Watch Demo</button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <h3>50%</h3>
              <p>Faster Service</p>
            </div>
            <div className="stat">
              <h3>30%</h3>
              <p>Higher Revenue</p>
            </div>
            <div className="stat">
              <h3>100%</h3>
              <p>Customer Satisfaction</p>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="mockup">
            <div className="mockup-phone">
              <div className="screen">
                <div className="app-screen">
                  <div className="app-header">Restaurant Name</div>
                  <div className="menu-items">
                    <div className="menu-item">🍔 Classic Burger - $12</div>
                    <div className="menu-item">🍕 Margherita Pizza - $15</div>
                    <div className="menu-item">🥗 Caesar Salad - $10</div>
                    <div className="menu-item">🍝 Pasta Alfredo - $14</div>
                  </div>
                  <div className="order-button">Place Order</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2>Why Choose QRMenuPro?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.step}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
          <div className="workflow-visual">
            <div className="workflow-step">
              <div className="workflow-icon">📱</div>
              <p>Customer Scans</p>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="workflow-icon">📝</div>
              <p>Places Order</p>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="workflow-icon">👨‍🍳</div>
              <p>Kitchen Prepares</p>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="workflow-icon">✅</div>
              <p>Order Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <h2>What Our Customers Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Transform Your Restaurant?</h2>
          <p>Join hundreds of restaurants already using QRMenuPro</p>
          <div className="cta-buttons">
            <button className="btn-primary large">Start Free Trial</button>
            <button className="btn-secondary large">Schedule Demo</button>
          </div>
          <div className="cta-features">
            <span>✓ No credit card required</span>
            <span>✓ Setup in 15 minutes</span>
            <span>✓ 24/7 Support</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>QRMenuPro</h3>
              <p>Revolutionizing restaurant dining experiences through smart technology.</p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#pricing">Pricing</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#careers">Careers</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 QRMenuPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
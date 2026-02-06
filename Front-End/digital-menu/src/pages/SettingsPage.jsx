import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../SettingsPage.css";
import "../AdminDashboard.css";

function SettingsPage() {
  const { userId } = useParams();
  const [activeSection, setActiveSection] = useState('settings');
  const [settings, setSettings] = useState({
    restaurantName: "Smart Digital Menu",
    email: "",
    phone: "",
    address: "",
    currency: "₹",
    timezone: "Asia/Kolkata"
  });

  const handleSave = () => {
    // Save settings logic here
    alert("Settings saved successfully!");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="main-content">
        <div className="settings-container">
          <header className="page-header">
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your restaurant settings and preferences</p>
          </header>

          <div className="settings-sections">
            {/* Restaurant Information */}
            <div className="settings-card">
              <div className="card-header">
                <h3>Restaurant Information</h3>
                <p>Update your restaurant details</p>
              </div>
              <div className="form-grid">
                <div className="input-wrapper">
                  <label>Restaurant Name</label>
                  <input
                    className="settings-input"
                    value={settings.restaurantName}
                    onChange={(e) => setSettings({...settings, restaurantName: e.target.value})}
                  />
                </div>
                <div className="input-wrapper">
                  <label>Email</label>
                  <input
                    type="email"
                    className="settings-input"
                    placeholder="restaurant@example.com"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                  />
                </div>
                <div className="input-wrapper">
                  <label>Phone</label>
                  <input
                    className="settings-input"
                    placeholder="+91 9876543210"
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  />
                </div>
                <div className="input-wrapper full-width">
                  <label>Address</label>
                  <textarea
                    className="settings-textarea"
                    placeholder="Enter restaurant address"
                    value={settings.address}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* System Preferences */}
            <div className="settings-card">
              <div className="card-header">
                <h3>System Preferences</h3>
                <p>Configure system settings</p>
              </div>
              <div className="form-grid">
                <div className="input-wrapper">
                  <label>Currency</label>
                  <select
                    className="settings-select"
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  >
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                  </select>
                </div>
                <div className="input-wrapper">
                  <label>Timezone</label>
                  <select
                    className="settings-select"
                    value={settings.timezone}
                    onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="btn-save-settings" onClick={handleSave}>
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
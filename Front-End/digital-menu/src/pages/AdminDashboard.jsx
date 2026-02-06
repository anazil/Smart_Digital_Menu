import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import Sidebar from "../components/Sidebar";
import "../AdminDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Icon Component
const Icon = ({ name, className = "" }) => {
  const icons = {
    'chart-bar': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    'table-cells': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3H6zM8 7h8M8 11h8M8 15h8" />
      </svg>
    ),
    'clipboard-document-list': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    'shopping-bag': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    'fire': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    ),
    'tv': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    'chart-line': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    'users': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    'cog-6-tooth': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    'currency-rupee': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'clock': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'check-circle': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'x-circle': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'arrow-left': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
    ),
    'arrow-right': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    ),
    'arrow-right-on-rectangle': (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
      </svg>
    )
  };
  
  return icons[name] || null;
};

function AdminDashboard() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [hoveredCard, setHoveredCard] = useState(null);

  // Sample data for charts
  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales (₹)',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500',
          },
          callback: function(value) {
            return '₹' + value.toLocaleString();
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
  };

  const categoryData = {
    labels: ['Main Course', 'Starters', 'Drinks', 'Desserts'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
        ],
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
    },
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'chart-bar', path: `/dash/${userId}` },
    { id: 'tables', label: 'Table Management', icon: 'table-cells', path: `/tableadmin/${userId}` },
    { id: 'menu', label: 'Menu Management', icon: 'clipboard-document-list', path: `/admin/${userId}` },
    { id: 'orders', label: 'Orders', icon: 'shopping-bag', path: `/orders/${userId}` },
    { id: 'kitchen', label: 'Kitchen Dashboard', icon: 'fire', path: `/kitchenpage/${userId}` },
    { id: 'hall', label: 'Hall Display', icon: 'tv', path: `/hallscreen/${userId}` },
    { id: 'analytics', label: 'Analytics', icon: 'chart-line', path: `/analytics/${userId}` },
    { id: 'customers', label: 'Customers', icon: 'users', path: `/customers/${userId}` },
    { id: 'settings', label: 'Settings', icon: 'cog-6-tooth', path: `/settings/${userId}` }
  ];

  const kpiData = [
    { title: 'Total Orders Today', value: '247', trend: '+12%', color: 'blue', icon: 'shopping-bag' },
    { title: 'Revenue Today', value: '₹18,450', trend: '+8%', color: 'green', icon: 'currency-rupee' },
    { title: 'Active Tables', value: '12/16', trend: '75%', color: 'purple', icon: 'table-cells' },
    { title: 'Orders in Progress', value: '8', trend: '-2%', color: 'orange', icon: 'clock' },
    { title: 'Completed Orders', value: '239', trend: '+15%', color: 'teal', icon: 'check-circle' },
    { title: 'Cancelled Orders', value: '3', trend: '-50%', color: 'red', icon: 'x-circle' }
  ];

  const handleNavigation = (item) => {
    setActiveSection(item.id);
    if (item.path !== `/dash/${userId}`) {
      navigate(item.path);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <h1>Dashboard Overview</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>
          <div className="header-right">
            <div className="user-profile">
              <div className="avatar">👤</div>
              <span>Restaurant Owner</span>
            </div>
          </div>
        </header>

        {/* Enhanced KPI Cards */}
        <section className="kpi-section">
          <div className="kpi-grid">
            {kpiData.map((kpi, index) => (
              <div 
                key={index} 
                className={`kpi-card ${kpi.color}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="kpi-header">
                  <div className="kpi-icon-wrapper">
                    <Icon name={kpi.icon} className="kpi-icon w-5 h-5" />
                  </div>
                  <span className={`trend ${kpi.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                    {kpi.trend}
                  </span>
                </div>
                <div className="kpi-content">
                  <h3 className="kpi-value">{kpi.value}</h3>
                  <p className="kpi-title">{kpi.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced Analytics Section */}
        <section className="analytics-section">
          <div className="analytics-grid">
            {/* Animated Sales Chart */}
            <div className="chart-card sales-chart">
              <div className="chart-header">
                <h3>Sales Overview</h3>
                <select className="chart-filter">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>
              </div>
              <div className="chart-container">
                <Line data={salesData} options={salesOptions} />
              </div>
            </div>

            {/* Enhanced Orders by Category */}
            <div className="chart-card category-chart">
              <div className="chart-header">
                <h3>Orders by Category</h3>
                <div className="chart-stats">
                  <span className="total-orders">247 Orders</span>
                </div>
              </div>
              <div className="chart-container category-container">
                <div className="doughnut-wrapper">
                  <Doughnut data={categoryData} options={categoryOptions} />
                </div>
                <div className="category-legend">
                  {categoryData.labels.map((label, index) => (
                    <div key={label} className="legend-item">
                      <span 
                        className="legend-dot"
                        style={{ backgroundColor: categoryData.datasets[0].backgroundColor[index] }}
                      ></span>
                      <span className="legend-label">{label}</span>
                      <span className="legend-value">{categoryData.datasets[0].data[index]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Quick Actions - Single Container */}
        <section className="quick-actions">
          <div className="quick-actions-container">
            <div className="quick-actions-header">
              <h2 className="section-title">Quick Actions</h2>
              <p className="section-subtitle">Manage your restaurant operations efficiently</p>
            </div>
            
            <div className="action-cards">
              {[
                { 
                  icon: 'table-cells', 
                  title: 'Manage Tables', 
                  desc: 'Add or configure restaurant tables',
                  path: `/tableadmin/${userId}`,
                  color: 'blue'
                },
                { 
                  icon: 'clipboard-document-list', 
                  title: 'Update Menu', 
                  desc: 'Add new items or edit existing menu',
                  path: `/admin/${userId}`,
                  color: 'green'
                },
                { 
                  icon: 'fire', 
                  title: 'Kitchen View', 
                  desc: 'Monitor live orders and status',
                  path: `/kitchenpage/${userId}`,
                  color: 'orange'
                }
              ].map((action, index) => (
                <div 
                  key={action.title}
                  className={`action-card ${action.color}`}
                  onClick={() => navigate(action.path)}
                >
                  <div className="action-icon">
                    <Icon name={action.icon} className="w-6 h-6" />
                  </div>
                  <div className="action-content">
                    <h4>{action.title}</h4>
                    <p>{action.desc}</p>
                  </div>
                  <div className="action-arrow">
                    <Icon name="arrow-right" className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
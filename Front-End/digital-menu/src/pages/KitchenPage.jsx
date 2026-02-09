import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import "../KitchenPage.css";

function KitchenPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const userId = localStorage.getItem("userId"); 
  
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/kitchen/orders/?user_id=${userId}`);
      const activeOrders = res.data.filter(order => order.status !== 'Served');
      setOrders(activeOrders);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/kitchen/order/${orderId}/status/`, {
        status: newStatus,
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#f59e0b';
      case 'Preparing': return '#3b82f6';
      case 'Ready': return '#10b981';
      case 'Served': return '#8b5cf6';
      case 'Completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div className="kitchen-dashboard">
      <div className="kitchen-header">
        <h1 className="kitchen-title">👨‍🍳 Kitchen Dashboard</h1>
        <div className="stats-bar">
          <div className="stat-item" onClick={() => setStatusFilter('all')} style={{cursor: 'pointer', opacity: statusFilter === 'all' ? 1 : 0.7}}>
            <span className="stat-number">{orders.length}</span>
            <span className="stat-label">Active Orders</span>
          </div>
          <div className="stat-item" onClick={() => setStatusFilter('Pending')} style={{cursor: 'pointer', opacity: statusFilter === 'Pending' ? 1 : 0.7}}>
            <span className="stat-number">{orders.filter(o => o.status === 'Pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item" onClick={() => setStatusFilter('Preparing')} style={{cursor: 'pointer', opacity: statusFilter === 'Preparing' ? 1 : 0.7}}>
            <span className="stat-number">{orders.filter(o => o.status === 'Preparing').length}</span>
            <span className="stat-label">Preparing</span>
          </div>
        </div>
      </div>
      
      <div className="orders-grid">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>No Active Orders</h3>
            <p>New orders will appear here automatically</p>
          </div>
        ) : (
          orders
            .filter(order => statusFilter === 'all' || order.status === statusFilter)
            .map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="table-info">
                  <h3>Table #{order.table.table_number}</h3>
                  <span className="order-time">#{order.id}</span>
                </div>
                <div className="status-badge" style={{backgroundColor: getStatusColor(order.status)}}>
                  {order.status}
                </div>
              </div>
              
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <span className="item-name">{item.menu_item.name}</span>
                    <span className="item-quantity">×{item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <div className="order-total">₹{order.total_amount}</div>
                <div className="status-buttons">
                  {order.status === 'Pending' && (
                    <button className="btn-action btn-start" onClick={() => handleStatusChange(order.id, 'Preparing')}>
                      Start Cooking
                    </button>
                  )}
                  {order.status === 'Preparing' && (
                    <button className="btn-action btn-ready" onClick={() => handleStatusChange(order.id, 'Ready')}>
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'Ready' && (
                    <button className="btn-action btn-served" onClick={() => handleStatusChange(order.id, 'Served')}>
                      Mark Served
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default KitchenPage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../HallScreenPage.css";

function HallScreenPage() {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");
  // Fetch active orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/hall/orders/?user_id=${userId}`);
      const activeOrders = res.data.filter(order => order.status !== 'Served');
      setOrders(activeOrders);
    } catch (err) {
      console.error("Error fetching hall orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000); // refresh every 3s
    return () => clearInterval(interval);
  }, []);

  // Get color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f39c12";
      case "Preparing":
        return "#3498db";
      case "Ready":
        return "#2ecc71";
      case "Served":
        return "#9b59b6";
      default:
        return "#7f8c8d";
    }
  };

  return (
    <div className="hall-container">
      <h1 className="hall-title">🍽️ Live Order Status</h1>
      <div className="hall-grid">
        {orders.length === 0 ? (
          <p className="no-orders">No active orders right now</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="hall-card"
              style={{ borderColor: getStatusColor(order.status) }}
            >
              <h2>
                Table #{order.table?.table_number ?? "N/A"}
              </h2>

              <p
                className="order-status"
                style={{ color: getStatusColor(order.status) }}
              >
                {order.status}
              </p>

              <ul>
                {order.items?.map((it) => (
                  <li key={it.id}>
                    {it.menu_item?.name} × {it.quantity}
                  </li>
                ))}
              </ul>

              <p className="total">Total: ₹{order.total_amount}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HallScreenPage;

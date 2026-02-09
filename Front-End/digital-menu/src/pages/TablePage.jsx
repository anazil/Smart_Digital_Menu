import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";
import "../TablePage.css";
import { useRef } from 'react';


function TablePage() {
  const navigate = useNavigate();
  const { tableNumber,userId } = useParams(); 
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [categories, setCategories] = useState([]);
  const categoryScrollRef = useRef(null);
  
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/categories/${userId}/`);
      setCategories([{ id: 'all', name: 'All', icon: '🍽️' }, ...res.data]);
    } catch (err) {
      console.error(err);
      setCategories([{ id: 'all', name: 'All', icon: '🍽️' }]);
    }
  };
  
  const filteredItems = activeCategory === 'All' 
    ? menuItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : menuItems.filter(item => 
        item.category?.name === activeCategory && 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  const startPayment = async () => {
  const items = cart.map((c) => ({ id: c.id, quantity: c.qty }));
  if (items.length === 0) return alert("Cart is empty 😅");

  // Create payment order
  const res = await axios.post(`${API_BASE_URL}/api/create-payment-order/`, {
    amount: total
  });

  const options = {
    key: "rzp_test_Rh50g9UE2UHFU5", 
    order_id: res.data.id,
    amount: res.data.amount,
    currency: "INR",
    name: "CliqEat",
    description: "Restaurant Table Order Payment",

    handler: async function (response) {
      alert("Payment Success! Order placed successfully");
      
      const orderResponse = await axios.post(`${API_BASE_URL}/api/create-order/`, {
        table_number: parseInt(tableNumber),
        user_id: parseInt(userId),
        items: items,
      });

      console.log("ORDER RESPONSE:", orderResponse.data);
      console.log("ORDER ID:", orderResponse.data.order_id);

      localStorage.setItem("lastOrderId", orderResponse.data.order.id);

      navigate("/ordersuccess");
      setCart([]);
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


  // Fetch menu items from API
  useEffect(() => {
    fetchCategories();
    axios.get(`${API_BASE_URL}/api/menu-all/${userId}/`)
      .then((response) => {
        const availableItems=response.data.filter(item=>item.available)
        setMenuItems(availableItems);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
        setLoading(false);
      });
  }, [userId]);

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter((c) => c.id !== id));
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Send order to backend
  const placeOrder = async () => {
    const items = cart.map((c) => ({ id: c.id, quantity: c.qty }));

    try {
      const response = await axios.post(`${API_BASE_URL}/api/create-order/`, {
        table_number: parseInt(tableNumber),
        user_id: parseInt(userId), 
        items: items,
      });

      alert("✅ Order placed successfully!");
      console.log(response.data);
      setCart([]);
    } catch (error) {
      console.error("Order error:", error);
      alert("⚠️ Failed to place order");
    }
  };

  if (loading) return (
    <div className="modern-loading">
      <div className="loading-circle"></div>
      <p className="loading-text">Loading delicious menu...</p>
    </div>
  );

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Modern Floating Header */}
      <div className="modern-header">
        <button className="header-icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="header-center">
          <h1 className="header-title">What would you like to order?</h1>
          <p className="table-badge">Table {tableNumber}</p>
        </div>
        <button className="header-icon-btn profile-btn">
          <div className="profile-avatar">👤</div>
        </button>
      </div>

      {/* Search + Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="filter-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>

      {/* Category Pills */}
      <div className="category-container">
        <button className="category-arrow category-arrow-left" onClick={() => {
          if (categoryScrollRef.current) {
            categoryScrollRef.current.scrollBy({left: -120, behavior: 'smooth'});
          }
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
        </button>
        <div className="category-scroll" ref={categoryScrollRef}>
          {categories.map((category) => (
            <button
              key={category.name}
              className={`category-pill ${activeCategory === category.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.name)}
            >
              <span className="category-emoji">{category.icon}</span>
              <span className="category-text">{category.name}</span>
            </button>
          ))}
        </div>
        <button className="category-arrow category-arrow-right" onClick={() => {
          if (categoryScrollRef.current) {
            categoryScrollRef.current.scrollBy({left: 120, behavior: 'smooth'});
          }
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6"/>
          </svg>
        </button>
      </div>

      {/* Food Grid */}
      <div className="food-grid-container">
        <div className="food-grid">
          {filteredItems.map((item) => (
            <div className="modern-food-card" key={item.id}>
              <div className="food-image-wrapper">
                <img
                  src={item.image ? `${API_BASE_URL}${item.image}` : "https://via.placeholder.com/200x150/FF7A5A/white?text=🍽️"}
                  alt={item.name}
                  className="food-image"
                />
              </div>
              <div className="food-details">
                <h3 className="food-name">{item.name}</h3>
                <p className="food-desc">Spicy • Veg</p>
                <div className="food-bottom">
                  <span className="food-price">₹{item.price}</span>
                  <button className="add-button" onClick={() => addToCart(item)}>
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Bottom Cart CTA */}
      {cart.length > 0 && (
        <div className="bottom-cart-cta">
          <div className="cart-summary" onClick={() => document.querySelector('.cart-details').classList.toggle('open')}>
            <div className="cart-left">
              <div className="cart-count-badge">{cart.reduce((sum, item) => sum + item.qty, 0)}</div>
              <span className="cart-text">View Cart</span>
            </div>
            <div className="cart-right">
              <span className="cart-total-amount">₹{total}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </div>
          </div>
          
          <div className="cart-details">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-info">
                  <h5>{item.name}</h5>
                  <span className="cart-item-price">₹{item.price} × {item.qty}</span>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>×</button>
              </div>
            ))}
            <button className="checkout-button" onClick={startPayment}>
              Pay & Order ₹{total}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TablePage;

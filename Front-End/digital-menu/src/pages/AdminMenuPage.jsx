import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import API_BASE_URL from "../config/api";
import "../AdminMenuPage.css";
import "../AdminDashboard.css";

function AdminMenuPage() {
  const { userId } = useParams(); 
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: 0, description: "", available: true, category_id: "" });
  const [newCategory, setNewCategory] = useState({ name: "", icon: "🍽️" });
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [activeSection, setActiveSection] = useState('menu');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const categoryIconSuggestions = {
    'burger': '🍔',
    'pizza': '🍕',
    'pasta': '🍝',
    'noodles': '🍜',
    'rice': '🍚',
    'meat': '🍗',
    'chicken': '🍗',
    'beef': '🥩',
    'fish': '🌟',
    'seafood': '🦐',
    'salad': '🥗',
    'soup': '🍲',
    'fries': '🍟',
    'sandwich': '🥪',
    'taco': '🌮',
    'dessert': '🍰',
    'cake': '🎂',
    'ice cream': '🍦',
    'drink': '🥤',
    'coffee': '☕',
    'tea': '🍵',
    'juice': '🥤',
    'beer': '🍺',
    'wine': '🍷',
    'bread': '🍞',
    'breakfast': '🍳',
    'snack': '🍿',
    'vegetarian': '🥬',
    'vegan': '🥗'
  };
  
  const getSuggestedIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(categoryIconSuggestions)) {
      if (name.includes(key)) {
        return icon;
      }
    }
    return '🍽️';
  };

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/menu-all/${userId}/`);
      setMenuItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/categories/${userId}/`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/add-category/`, {
        name: newCategory.name,
        icon: newCategory.icon,
        user_id: userId
      });
      alert("✅ Category added successfully!");
      setNewCategory({ name: "", icon: "🍽️" });
      setShowCategoryForm(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add category");
    }
  };

  const handleAdd = async () => {
    if (!newItem.category_id) {
      alert("Please select a category");
      return;
    }
    
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("price", newItem.price);
    formData.append("description", newItem.description);
    formData.append("available", newItem.available);
    formData.append("category_id", newItem.category_id);
    formData.append("user_id", userId); 

  if (newItem.image) {
    formData.append("image", newItem.image);
  }

  try {
    await axios.post(`${API_BASE_URL}/api/add-menu-item/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("✅ Item added successfully!");
    setNewItem({ name: "", price: 0, description: "", available: true, category_id: "", image: null });
    fetchMenu();
  } catch (err) {
    console.error(err);
    alert("❌ Failed to add item");
  }
};

// ✅ Toggle availability (PATCH request)
const handleToggleAvailable = async (item) => {
  try {
    const updatedData = { available: !item.available };
    await axios.patch(`${API_BASE_URL}/api/update-menu-item/${item.id}/`, updatedData);
    fetchMenu(); // refresh menu list
  } catch (err) {
    console.error("Toggle failed:", err);
    alert("❌ Failed to toggle availability");
  }
};

// ✅ Delete menu item (DELETE request)
const handleDelete = async (itemId) => {
  if (!window.confirm("Are you sure you want to delete this item?")) return;
  try {
    await axios.delete(`${API_BASE_URL}/api/delete-menu-item/${itemId}/`);
    alert("🗑️ Item deleted successfully!");
    fetchMenu(); // refresh after delete
  } catch (err) {
    console.error("Delete failed:", err);
    alert("❌ Failed to delete item");
  }
};


  return (
    <div className="dashboard-layout">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="main-content">
        <div className="admin-menu-container">
          <header className="page-header">
            <h1 className="page-title">Menu Management</h1>
            <p className="page-subtitle">Manage your restaurant menu items and pricing</p>
          </header>

          {/* Category Management */}
          <div className="category-section">
            <div className="section-header">
              <h3>Categories ({categories.length})</h3>
              <button className="btn-add-category" onClick={() => setShowCategoryForm(!showCategoryForm)}>
                {showCategoryForm ? 'Cancel' : 'Add Category'}
              </button>
            </div>
            
            {showCategoryForm && (
              <div className="category-form">
                <div className="form-row">
                  <input
                    className="menu-input"
                    placeholder="Category name"
                    value={newCategory.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const suggestedIcon = getSuggestedIcon(name);
                      setNewCategory({ name, icon: suggestedIcon });
                    }}
                  />
                  <input
                    className="menu-input"
                    placeholder="Icon (emoji)"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  />
                  <button className="btn-save-category" onClick={handleAddCategory}>
                    Save
                  </button>
                </div>
              </div>
            )}
            
            <div className="categories-list">
              {categories.map((cat) => (
                <div key={cat.id} className="category-chip">
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Item Card */}
          <div className="add-item-section">
            <div className="add-item-card">
              <div className="card-header">
                <h3>Add New Menu Item</h3>
                <p>Create a new dish for your restaurant menu</p>
              </div>
              <div className="form-grid">
                <div className="input-wrapper">
                  <label>Item Name</label>
                  <input
                    className="menu-input"
                    placeholder="Enter dish name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>
                <div className="input-wrapper">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    className="menu-input"
                    placeholder="Enter price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  />
                </div>
                <div className="input-wrapper">
                  <label>Category</label>
                  <select
                    className="menu-select"
                    value={newItem.category_id}
                    onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-wrapper full-width">
                  <label>Description</label>
                  <textarea
                    className="menu-textarea"
                    placeholder="Enter item description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>
                <div className="input-wrapper">
                  <label>Item Image</label>
                  <input
                    type="file"
                    className="file-input"
                    accept="image/*"
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
                  />
                </div>
                <div className="input-wrapper">
                  <label>Availability</label>
                  <select
                    className="menu-select"
                    value={newItem.available}
                    onChange={(e) => setNewItem({ ...newItem, available: e.target.value === 'true' })}
                  >
                    <option value={true}>Available</option>
                    <option value={false}>Not Available</option>
                  </select>
                </div>
              </div>
              <button className="btn-add-item" onClick={handleAdd}>
                Add Menu Item
              </button>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="menu-items-section">
            <div className="section-header">
              <h3>Menu Items ({menuItems.filter(item => categoryFilter === 'all' || item.category?.id == categoryFilter).length})</h3>
              <select 
                className="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="menu-items-grid">
              {menuItems
                .filter(item => categoryFilter === 'all' || item.category?.id == categoryFilter)
                .map((item) => (
                <div key={item.id} className="menu-item-card">
                  <div className="menu-item-image">
                    <img
                      src={item.image ? `${API_BASE_URL}${item.image}` : "https://via.placeholder.com/200x150"}
                      alt={item.name}
                      className="item-img"
                    />
                    <div className={`availability-badge ${item.available ? 'available' : 'unavailable'}`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                  
                  <div className="menu-item-content">
                    <div className="item-category">
                      {item.category?.icon} {item.category?.name}
                    </div>
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-description">{item.description}</p>
                    <div className="item-price">₹{item.price}</div>
                  </div>
                  
                  <div className="menu-item-actions">
                    <button
                      className={`btn-toggle ${item.available ? 'btn-disable' : 'btn-enable'}`}
                      onClick={() => handleToggleAvailable(item)}
                    >
                      {item.available ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {menuItems.filter(item => categoryFilter === 'all' || item.category?.id == categoryFilter).length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h3>No Menu Items Found</h3>
                <p>{categoryFilter === 'all' ? 'Add your first menu item to get started' : 'No items in this category'}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
export default AdminMenuPage;

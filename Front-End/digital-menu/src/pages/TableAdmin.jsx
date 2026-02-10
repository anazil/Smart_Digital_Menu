import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Alert from "../components/Alert";
import API_BASE_URL from "../config/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../TableAdmin.css";
import "../AdminDashboard.css";

function TableAdmin() {
  const [tableNumber, setTableNumber] = useState("");
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('tables');
  const [searchTerm, setSearchTerm] = useState("");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [alert, setAlert] = useState(null);

  const templates = [
    { id: 1, name: 'Classic', preview: 'Simple white card with QR code' },
    { id: 2, name: 'Modern', preview: 'Gradient background with rounded corners' },
    { id: 3, name: 'Elegant', preview: 'Black and gold theme with border' }
  ];
  
  const filteredTables = tables.filter(table => 
    table.table_number.toString().includes(searchTerm)
  );
  const { userId } = useParams();


  // Fetch all tables


  const fetchTables = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/all-tables/?user_id=${userId}`);
      setTables(res.data);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Add new table
  const handleAddTable = async () => {
    if (!tableNumber) {
      setAlert({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter a table number before adding.',
        showConfirm: false
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/add-table/`, {
        table_number: parseInt(tableNumber, 10),
        user_id: userId,
      });
      setTableNumber("");
      fetchTables();
      setAlert({
        type: 'success',
        title: 'Table Created',
        message: `Table #${tableNumber} is ready for customers`,
        showConfirm: false
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setAlert({
        type: 'error',
        title: 'Failed to Add Table',
        message: err.response?.data?.table_number || 'An error occurred while adding the table.',
        showConfirm: false
      });
    } finally {
      setLoading(false);
    }
  };

  //delete table
  const handleDeleteTable = async (id, tableNumber) => {
    setAlert({
      type: 'danger',
      title: 'Delete Table',
      message: `Are you sure you want to delete Table #${tableNumber}? This action cannot be undone.`,
      showConfirm: true,
      onConfirm: async () => {
        setAlert(null); // Close confirmation dialog
        try {
          await axios.delete(`${API_BASE_URL}/api/delete-table/${id}/`);
          fetchTables();
          setAlert(null); // Auto-close success message
        } catch (err) {
          console.error(err);
          setAlert({
            type: 'error',
            title: 'Delete Failed',
            message: 'An error occurred while deleting the table.',
            showConfirm: false
          });
        }
      }
    });
  };

  const handlePrintQR = (url, tableNumber) => {
    setSelectedTable({ url, tableNumber });
    setShowTemplateModal(true);
  };

  const printWithTemplate = (templateId) => {
    const { url, tableNumber } = selectedTable;
    const printWindow = window.open("", "_blank");
    
    let template = '';
    if (templateId === 1) {
      template = `
        <style>
          body { font-family: 'Arial', sans-serif; background: #f8fafc; padding: 30px; margin: 0; }
          .container { max-width: 400px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; }
          .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
          .restaurant-name { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 8px; }
          .greeting { font-size: 16px; color: #6b7280; margin-bottom: 20px; }
          .qr-section { margin: 30px 0; }
          .qr { width: 200px; height: 200px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .instruction { font-size: 14px; color: #374151; margin-top: 20px; font-weight: 500; }
          .table-info { background: #f3f4f6; padding: 15px; border-radius: 10px; margin-top: 20px; }
        </style>`;
    } else if (templateId === 2) {
      template = `
        <style>
          body { font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; margin: 0; min-height: 100vh; }
          .container { max-width: 400px; margin: 0 auto; background: rgba(255,255,255,0.95); border-radius: 25px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); text-align: center; backdrop-filter: blur(10px); }
          .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
          .restaurant-name { font-size: 26px; font-weight: bold; color: #1f2937; margin-bottom: 8px; }
          .greeting { font-size: 16px; color: #4f46e5; margin-bottom: 20px; font-weight: 500; }
          .qr-section { margin: 30px 0; }
          .qr { width: 200px; height: 200px; border-radius: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.15); border: 3px solid white; }
          .instruction { font-size: 14px; color: #374151; margin-top: 20px; font-weight: 500; }
          .table-info { background: linear-gradient(135deg, #f3f4f6, #e5e7eb); padding: 15px; border-radius: 15px; margin-top: 20px; }
        </style>`;
    } else {
      template = `
        <style>
          body { font-family: 'Georgia', serif; background: #0f172a; padding: 30px; margin: 0; min-height: 100vh; }
          .container { max-width: 420px; margin: 0 auto; background: #1e293b; border: 3px solid #fbbf24; border-radius: 20px; padding: 40px; box-shadow: 0 25px 50px rgba(251, 191, 36, 0.2); text-align: center; }
          .header { border-bottom: 2px solid #fbbf24; padding-bottom: 20px; margin-bottom: 30px; }
          .restaurant-name { font-size: 28px; font-weight: bold; color: #fbbf24; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
          .greeting { font-size: 16px; color: #e2e8f0; margin-bottom: 20px; font-style: italic; }
          .qr-section { margin: 30px 0; }
          .qr { width: 200px; height: 200px; border-radius: 15px; border: 3px solid #fbbf24; box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3); }
          .instruction { font-size: 14px; color: #cbd5e1; margin-top: 20px; font-weight: 500; }
          .table-info { background: rgba(251, 191, 36, 0.1); border: 1px solid #fbbf24; padding: 15px; border-radius: 10px; margin-top: 20px; color: #fbbf24; }
        </style>`;
    }

    printWindow.document.write(`
      <html>
        <head><title>Print QR - Table ${tableNumber}</title>${template}</head>
        <body>
          <div class="container">
            <div class="header">
              <div class="restaurant-name">Smart Digital Menu</div>
              <div class="greeting">Welcome to our restaurant!</div>
            </div>
            <div class="qr-section">
              <img src="${url}" class="qr" alt="QR Code" />
            </div>
            <div class="instruction">Scan QR code to view menu & place order</div>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    
    setShowTemplateModal(false);
  };



  return (
    <div className="dashboard-layout">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="main-content">
        <div className="admin-table-container">
          <header className="page-header">
            <h1 className="page-title">Table Management</h1>
            <p className="page-subtitle">Manage your restaurant tables and QR codes</p>
          </header>

          {/* Add New Table Card */}
          <div className="add-table-section">
            <div className="add-table-card">
              <div className="card-header">
                <h3>Add New Table</h3>
                <p>Create a new table with QR code for customer orders</p>
              </div>
              <div className="input-section">
                <div className="input-wrapper">
                  <label>Table Number</label>
                  <input
                    type="number"
                    className="table-input"
                    placeholder="Enter table number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  />
                </div>
                <button
                  className="btn-add-table"
                  onClick={handleAddTable}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Table"}
                </button>
              </div>
            </div>
          </div>

          {/* Tables List */}
          <div className="tables-section">
            <div className="section-header">
              <h3>All Tables ({filteredTables.length})</h3>
              <div className="search-wrapper">
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by table number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="table-grid">
              {filteredTables.map((table) => (
                <div key={table.id} className="table-card">
                  <div className="table-card-header">
                    <h4>Table #{table.table_number}</h4>
                    <span className="table-status active">Active</span>
                  </div>
                  
                  {table.qr_code ? (
                    <div className="table-card-body">
                      <div className="qr-section">
                        <img
                          src={`${API_BASE_URL}${table.qr_code}`}
                          alt="QR Code"
                          className="qr-img"
                        />
                      </div>
                      
                      <div className="table-actions">
                        <button
                          className="btn-action btn-print"
                          onClick={() => handlePrintQR(`${API_BASE_URL}${table.qr_code}`, table.table_number)}
                        >
                          Print QR
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDeleteTable(table.id, table.table_number)}
                        >
                          Delete
                        </button>
                      </div>
                      
                      <div className="table-link">
                        <a
                          href={`http://localhost:5173/table/${table.table_number}/${userId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-link"
                        >
                          View Table Page
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="no-qr">
                      <p>No QR code available</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {filteredTables.length === 0 && searchTerm && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No Tables Found</h3>
                <p>No tables match your search for "{searchTerm}"</p>
              </div>
            )}
            
            {tables.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🪑</div>
                <h3>No Tables Yet</h3>
                <p>Add your first table to get started with QR code ordering</p>
              </div>
            )}
          </div>
        </div>
        {showTemplateModal && (
          <div className="template-modal-overlay">
            <div className="template-modal">
              <h3>Choose Print Template</h3>
              <div className="template-grid">
                {templates.map(template => (
                  <div key={template.id} className="template-card" onClick={() => printWithTemplate(template.id)}>
                    <h4>{template.name}</h4>
                    <p>{template.preview}</p>
                  </div>
                ))}
              </div>
              <button className="btn-close-modal" onClick={() => setShowTemplateModal(false)}>Cancel</button>
            </div>
          </div>
        )}
        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            showConfirm={alert.showConfirm}
            onConfirm={alert.onConfirm}
            onClose={() => setAlert(null)}
          />
        )}
      </main>
    </div>
  );
}

export default TableAdmin;

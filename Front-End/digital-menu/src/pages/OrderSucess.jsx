import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../config/api';
import '../OrderSucess.css';

function OrderSucess() {
  const [animationStage, setAnimationStage] = useState(0);
  const orderId = localStorage.getItem("lastOrderId"); // or get from props/state

  useEffect(() => {
    const t1 = setTimeout(() => setAnimationStage(1), 500);
    const t2 = setTimeout(() => setAnimationStage(2), 1500);
    const t3 = setTimeout(() => setAnimationStage(3), 3000);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    };
  }, []);

  // DOWNLOAD BILL FUNCTION
  const downloadBill = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/download-bill/${orderId}/`,
        { method: "GET" }
      );

      if (!response.ok) {
        alert("Failed to download bill");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `bill_${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="payment-success-container">
      <div className="success-content">

        {/* Checkmark Animation */}
        <div className={`checkmark-container ${animationStage >= 1 ? 'animate' : ''}`}>
          <div className="checkmark">✓</div>
        </div>

        <h1 className={`success-title ${animationStage >= 1 ? 'slide-in' : ''}`}>
          Payment Successful!
        </h1>

        <p className={`success-message ${animationStage >= 1 ? 'slide-in' : ''}`}>
          Your delicious food is on its way! 🚀
        </p>

        {/* DOWNLOAD BILL BUTTON */}
        <button
          className="download-bill-btn"
          onClick={downloadBill}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Download Bill (PDF)
        </button>

      </div>
    </div>
  );
}

export default OrderSucess;

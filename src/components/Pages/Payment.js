
import React, { useState } from "react";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");


  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setMessage("");
    setStatus("");

    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first");
      }

      
      const orderResponse = await fetch(
        "https://technova-backend-hv79.onrender.com/api/payments/create-order",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const order = await orderResponse.json();

      if (!orderResponse.ok || !order.success) {
        throw new Error(order.message || "Order creation failed");
      }

      
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "TechNova",
        description: "Secure Test Payment",
        theme: {
          color: "#6366f1",
        },

        handler: async (response) => {
          setMessage("Verifying your payment...");
          setStatus("pending");

          try {
            const verifyResponse = await fetch(
              "https://technova-backend-hv79.onrender.com/api/payments/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(response),
              }
            );

            if (!verifyResponse.ok) {
              console.error("Verification API status:", verifyResponse.status);
            }

            const result = await verifyResponse.json();

            if (!verifyResponse.ok || !result.success) {
              throw new Error(
                result.message || "Payment verification failed"
              );
            }

            setStatus("success");
            setMessage("Payment verified successfully!");
          } catch (error) {
            setStatus("error");
            setMessage(error.message);
          }
        },

        modal: {
          ondismiss: () => {
            setMessage("Payment window closed");
            setStatus("error");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        setStatus("error");
        setMessage(
          response.error?.description || "Payment failed"
        );
      });

      razorpay.open();
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #dbeafe 0%, #ede9fe 50%, #fce7f3 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      boxSizing: "border-box",
    },

    card: {
      width: "100%",
      maxWidth: "430px",
      background: "#ffffff",
      borderRadius: "24px",
      padding: "36px 28px",
      textAlign: "center",
      boxShadow: "0 20px 60px rgba(79,70,229,0.15)",
      boxSizing: "border-box",
    },

    logo: {
      fontSize: "44px",
      marginBottom: "12px",
    },

    title: {
      fontSize: "25px",
      fontWeight: "700",
      color: "#1e293b",
      margin: "8px 0",
    },

    subtitle: {
      fontSize: "14px",
      color: "#64748b",
      marginBottom: "26px",
    },

    amountBox: {
      background: "linear-gradient(135deg, #eff6ff, #f5f3ff)",
      border: "1px solid #e0e7ff",
      borderRadius: "18px",
      padding: "24px",
      marginBottom: "22px",
    },

    amountLabel: {
      fontSize: "14px",
      color: "#64748b",
      margin: "0 0 8px",
    },

    amount: {
      fontSize: "42px",
      fontWeight: "800",
      color: "#4f46e5",
      margin: 0,
    },

    currency: {
      fontSize: "13px",
      color: "#818cf8",
      marginTop: "8px",
    },

    secureBadge: {
      background: "#ecfdf5",
      color: "#047857",
      padding: "12px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "20px",
    },

    button: {
      width: "100%",
      padding: "17px",
      border: "none",
      borderRadius: "14px",
      background: "linear-gradient(90deg, #2563eb, #7c3aed)",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "700",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.65 : 1,
      boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
    },

    note: {
      fontSize: "12px",
      color: "#94a3b8",
      marginTop: "20px",
    },

    message: {
      marginTop: "20px",
      padding: "12px",
      borderRadius: "10px",
      fontSize: "14px",
      background:
        status === "success"
          ? "#dcfce7"
          : status === "error"
          ? "#fee2e2"
          : "#eff6ff",
      color:
        status === "success"
          ? "#166534"
          : status === "error"
          ? "#991b1b"
          : "#1d4ed8",
    },

    footer: {
      marginTop: "25px",
      paddingTop: "18px",
      borderTop: "1px solid #e2e8f0",
      fontSize: "12px",
      color: "#94a3b8",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>💳</div>

        <h1 style={styles.title}>TechNova Payments</h1>

        <p style={styles.subtitle}>
          Fast, simple and secure checkout
        </p>

        <div style={styles.amountBox}>
          <p style={styles.amountLabel}>Total Amount</p>
          <h2 style={styles.amount}>₹500.00</h2>
          <p style={styles.currency}>INR • Indian Rupees</p>
        </div>

        <div style={styles.secureBadge}>
          🔒 Secure Test Payment
        </div>

        <button
          style={styles.button}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "🔐 Pay ₹500 Securely"}
        </button>

        {message && (
          <div style={styles.message} role="status">
            {status === "success" && "✅ "}
            {status === "error" && "⚠️ "}
            {message}
          </div>
        )}

        <p style={styles.note}>
          🧪 Test Mode — No real money will be deducted
        </p>

        <div style={styles.footer}>
          Powered by Razorpay • TechNova
        </div>
      </div>
    </div>
  );
};

export default Payment;

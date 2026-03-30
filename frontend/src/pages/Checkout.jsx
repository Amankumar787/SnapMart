import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../redux/slices/orderSlice";
import { clearCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

export default function Checkout() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.orders);
  const [address, setAddress]             = useState({ street: "", city: "", state: "", pincode: "", country: "India" });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [processing, setProcessing]       = useState(false);

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill all address fields"); return;
    }
    if (items.length === 0) { toast.error("Cart is empty"); return; }

    try {
      setProcessing(true);
      const result = await dispatch(createOrder({ shippingAddress: address, paymentMethod }));
      if (!createOrder.fulfilled.match(result)) {
        toast.error(result.payload || "Failed to place order"); return;
      }
      dispatch(clearCart());
      toast.success(paymentMethod === "qr" ? "Payment confirmed! Order placed." : "Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B1F", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .checkout-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 16px; font-size: 14px; color: #fff; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
        .checkout-input:focus { border-color: rgba(255,214,0,0.5); }
        .checkout-input::placeholder { color: rgba(255,255,255,0.3); }
        .pay-option { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 14px 16px; cursor: pointer; transition: all 0.2s; margin-bottom: 10px; }
        .pay-option.selected { background: rgba(255,214,0,0.08); border-color: rgba(255,214,0,0.4); }
        .pay-option:hover { border-color: rgba(255,255,255,0.2); }
        .radio { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
        .radio.checked { border-color: #FFD600; }
        .radio-dot { width: 8px; height: 8px; border-radius: 50%; background: #FFD600; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: "64px", background: "rgba(13,11,31,0.95)", backdropFilter: "blur(16px)", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
        <span onClick={() => navigate("/")} style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, cursor: "pointer" }}>
          ⚡<span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span>
        </span>
        <button onClick={() => navigate("/cart")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 16px", color: "#fff", cursor: "pointer" }}>← Back to Cart</button>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "32px", fontWeight: 800, marginBottom: "32px" }}>Checkout</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px" }}>

          {/* LEFT — Form */}
          <form onSubmit={handleOrder}>

            {/* Shipping Address */}
            <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Shipping Address</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { name: "street",  label: "Street Address", placeholder: "123 Main Street" },
                  { name: "city",    label: "City",           placeholder: "Mumbai" },
                  { name: "state",   label: "State",          placeholder: "Maharashtra" },
                  { name: "pincode", label: "Pincode",        placeholder: "400001" },
                  { name: "country", label: "Country",        placeholder: "India" },
                ].map(({ name, label, placeholder }) => (
                  <div key={name}>
                    <label style={{ fontSize: "12px", color: "#B8B5CC", marginBottom: "6px", display: "block" }}>{label}</label>
                    <input className="checkout-input" name={name} placeholder={placeholder} value={address[name]} onChange={handleChange} />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Payment Method</h2>

              {/* COD */}
              <div className={`pay-option${paymentMethod === "cod" ? " selected" : ""}`} onClick={() => setPaymentMethod("cod")}>
                <div className={`radio${paymentMethod === "cod" ? " checked" : ""}`}>
                  {paymentMethod === "cod" && <div className="radio-dot" />}
                </div>
                <span style={{ fontSize: "24px" }}>💵</span>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>Cash on Delivery</p>
                  <p style={{ fontSize: "12px", color: "#B8B5CC" }}>Pay when you receive your order</p>
                </div>
              </div>

              {/* QR */}
              <div className={`pay-option${paymentMethod === "qr" ? " selected" : ""}`} onClick={() => setPaymentMethod("qr")}>
                <div className={`radio${paymentMethod === "qr" ? " checked" : ""}`}>
                  {paymentMethod === "qr" && <div className="radio-dot" />}
                </div>
                <span style={{ fontSize: "24px" }}>📱</span>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>Pay via UPI / QR</p>
                  <p style={{ fontSize: "12px", color: "#B8B5CC" }}>Paytm, GPay, PhonePe, any UPI app</p>
                </div>
              </div>

              {/* QR Code Display */}
              {paymentMethod === "qr" && (
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "24px", marginTop: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "13px", color: "#B8B5CC", marginBottom: "16px" }}>Scan with any UPI app to pay</p>
                  <div style={{ background: "#fff", borderRadius: "12px", padding: "12px", display: "inline-block", marginBottom: "16px" }}>
                    <img
                      src="/P aytm-qr.jpeg"
                      alt="UPI QR Code"
                      style={{ width: "180px", height: "180px", display: "block", objectFit: "contain" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div style={{ width: "180px", height: "180px", display: "none", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px", background: "#f3f4f6", borderRadius: "8px" }}>
                      <span style={{ fontSize: "40px" }}>📱</span>
                      <p style={{ fontSize: "12px", color: "#666", textAlign: "center" }}>Add paytm-qr.png to public/ folder</p>
                    </div>
                  </div>
                  <p style={{ fontSize: "16px", fontWeight: 700, color: "#FFD600", marginBottom: "4px" }}>₹{totalPrice?.toLocaleString()}</p>
                  <p style={{ fontSize: "12px", color: "#B8B5CC", marginBottom: "12px" }}>Pay exactly this amount</p>
                  <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "8px", padding: "10px 14px" }}>
                    <p style={{ fontSize: "12px", color: "#22c55e" }}>✓ After scanning and paying, click the button below to confirm your order</p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || processing}
              style={{ width: "100%", background: "#FFD600", color: "#0D0B1F", border: "none", borderRadius: "10px", padding: "16px", fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, cursor: loading || processing ? "not-allowed" : "pointer", opacity: loading || processing ? 0.7 : 1, transition: "all 0.2s" }}
            >
              {processing ? "Placing Order..." : paymentMethod === "qr" ? "✓ I have paid — Confirm Order" : "Place Order (COD)"}
            </button>

          </form>

          {/* RIGHT — Order Summary */}
          <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", height: "fit-content", position: "sticky", top: "80px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Order Summary</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              {items.map((item) => (
                <div key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "rgba(255,255,255,0.04)", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.product?.images?.[0]?.url ? (
                        <img src={item.product.images[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : <span style={{ fontSize: "16px" }}>📦</span>}
                    </div>
                    <span style={{ color: "#B8B5CC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.product?.title} x{item.quantity}</span>
                  </div>
                  <span style={{ fontWeight: 500, flexShrink: 0 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", paddingTop: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#B8B5CC", marginBottom: "8px" }}>
                <span>Subtotal</span>
                <span>₹{totalPrice?.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#B8B5CC", marginBottom: "8px" }}>
                <span>Shipping</span>
                <span style={{ color: "#22c55e" }}>Free</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#B8B5CC" }}>
                <span>Payment</span>
                <span style={{ color: "#FFD600", textTransform: "uppercase" }}>{paymentMethod === "qr" ? "UPI / QR" : "COD"}</span>
              </div>
            </div>

            <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px" }}>Total</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "22px", color: "#FFD600" }}>₹{totalPrice?.toLocaleString()}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
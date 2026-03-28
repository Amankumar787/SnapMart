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

  const [address, setAddress] = useState({ street: "", city: "", state: "", pincode: "", country: "India" });

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill all address fields"); return;
    }
    if (items.length === 0) { toast.error("Cart is empty"); return; }

    const result = await dispatch(createOrder({ shippingAddress: address, paymentMethod: "cod" }));
    if (createOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      navigate("/orders");
    } else {
      toast.error(result.payload || "Failed to place order");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B1F", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .checkout-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 16px; font-size: 14px; color: #fff; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
        .checkout-input:focus { border-color: rgba(255,214,0,0.5); }
        .checkout-input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: "64px", background: "rgba(13,11,31,0.95)", backdropFilter: "blur(16px)", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
        <span onClick={() => navigate("/")} style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, cursor: "pointer" }}>⚡<span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span></span>
        <button onClick={() => navigate("/cart")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 16px", color: "#fff", cursor: "pointer" }}>← Back to Cart</button>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "32px", fontWeight: 800, marginBottom: "32px" }}>Checkout</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px" }}>
          {/* Address Form */}
          <form onSubmit={handleOrder}>
            <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Shipping Address</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { name: "street", label: "Street Address", placeholder: "123 Main Street" },
                  { name: "city",   label: "City",           placeholder: "Mumbai" },
                  { name: "state",  label: "State",          placeholder: "Maharashtra" },
                  { name: "pincode",label: "Pincode",        placeholder: "400001" },
                  { name: "country",label: "Country",        placeholder: "India" },
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
              <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.25)", borderRadius: "10px", padding: "14px 16px" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#FFD600" }} />
                <span style={{ fontSize: "14px" }}>Cash on Delivery (COD)</span>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: "100%", background: "#FFD600", color: "#0D0B1F", border: "none", borderRadius: "10px", padding: "16px", fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          {/* Order Summary */}
          <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", height: "fit-content" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Order Summary</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              {items.map((item) => (
                <div key={item._id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "#B8B5CC" }}>{item.product?.title} x{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)", paddingTop: "12px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>Total</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "20px", color: "#FFD600" }}>₹{totalPrice?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
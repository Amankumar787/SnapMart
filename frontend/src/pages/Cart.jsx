import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart, removeFromCart, updateCartItem } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

export default function Cart() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items, totalPrice, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    dispatch(fetchCart());
  }, [user, dispatch, navigate]);

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success("Item removed!");
  };

  const handleQtyChange = (itemId, qty) => {
    if (qty < 1) return;
    dispatch(updateCartItem({ itemId, quantity: qty }));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B1F", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .qty-btn { width: 28px; height: 28px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .qty-btn:hover { background: rgba(255,255,255,0.12); }
        .remove-btn { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 6px; padding: 4px 12px; color: #ef4444; font-size: 12px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .remove-btn:hover { background: rgba(239,68,68,0.2); }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: "64px", background: "rgba(13,11,31,0.95)", backdropFilter: "blur(16px)", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
        <span onClick={() => navigate("/")} style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, cursor: "pointer" }}>⚡<span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span></span>
        <button onClick={() => navigate("/products")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 16px", color: "#fff", cursor: "pointer" }}>← Continue Shopping</button>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "32px", fontWeight: 800, marginBottom: "32px" }}>Your Cart</h1>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", color: "#B8B5CC" }}>Loading cart...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛒</div>
            <p style={{ color: "#B8B5CC", fontSize: "16px", marginBottom: "24px" }}>Your cart is empty</p>
            <button onClick={() => navigate("/products")} style={{ background: "#FFD600", color: "#0D0B1F", border: "none", borderRadius: "10px", padding: "12px 28px", fontFamily: "'Syne', sans-serif", fontWeight: 700, cursor: "pointer" }}>Shop Now</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px" }}>
            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {items.map((item) => (
                <div key={item._id} style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", display: "flex", gap: "16px", alignItems: "center" }}>
                  {/* Image */}
                  <div style={{ width: "80px", height: "80px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", overflow: "hidden", flexShrink: 0 }}>
                    {item.product?.images?.[0]?.url ? (
                      <img src={item.product.images[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>📦</div>}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>{item.product?.title}</h3>
                    <p style={{ fontSize: "13px", color: "#FFD600", fontWeight: 600 }}>₹{item.price?.toLocaleString()}</p>
                  </div>

                  {/* Qty */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button className="qty-btn" onClick={() => handleQtyChange(item._id, item.quantity - 1)}>−</button>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => handleQtyChange(item._id, item.quantity + 1)}>+</button>
                  </div>

                  {/* Subtotal */}
                  <div style={{ minWidth: "80px", textAlign: "right" }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#fff" }}>₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>

                  <button className="remove-btn" onClick={() => handleRemove(item._id)}>Remove</button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", height: "fit-content" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Order Summary</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#B8B5CC" }}>
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{totalPrice?.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#B8B5CC" }}>
                  <span>Shipping</span>
                  <span style={{ color: "#22c55e" }}>Free</span>
                </div>
                <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)", paddingTop: "12px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>Total</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "20px", color: "#FFD600" }}>₹{totalPrice?.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => navigate("/checkout")} style={{ width: "100%", background: "#FFD600", color: "#0D0B1F", border: "none", borderRadius: "10px", padding: "14px", fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
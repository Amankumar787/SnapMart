import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder } from "../redux/slices/orderSlice";

const STEPS = ["placed", "confirmed", "processing", "shipped", "delivered"];

const STEP_META = {
  placed:     { label: "Order Placed",    icon: "📋", desc: "We've received your order" },
  confirmed:  { label: "Confirmed",       icon: "✅", desc: "Your order has been confirmed" },
  processing: { label: "Processing",      icon: "⚙️", desc: "Your order is being prepared" },
  shipped:    { label: "Shipped",         icon: "🚚", desc: "Your order is on the way" },
  delivered:  { label: "Delivered",       icon: "🎉", desc: "Your order has been delivered" },
};

const STATUS_COLOR = {
  placed:     "#FFD600",
  confirmed:  "#3b82f6",
  processing: "#f97316",
  shipped:    "#8b5cf6",
  delivered:  "#22c55e",
  cancelled:  "#ef4444",
};

export default function OrderDetail() {
  const { id }    = useParams();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { order, loading } = useSelector((state) => state.orders);

  useEffect(() => { dispatch(fetchOrder(id)); }, [id, dispatch]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0D0B1F", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      Loading...
    </div>
  );
  if (!order) return null;

  const isCancelled   = order.orderStatus === "cancelled";
  const currentStep   = STEPS.indexOf(order.orderStatus);
  const statusColor   = STATUS_COLOR[order.orderStatus];

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B1F", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: "64px", background: "rgba(13,11,31,0.95)", backdropFilter: "blur(16px)", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
        <span onClick={() => navigate("/")} style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, cursor: "pointer" }}>⚡<span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span></span>
        <button onClick={() => navigate("/orders")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 16px", color: "#fff", cursor: "pointer" }}>← My Orders</button>
      </nav>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <p style={{ fontSize: "13px", color: "#B8B5CC", marginBottom: "4px" }}>
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "26px", fontWeight: 800 }}>
              Order #{order._id?.slice(-8).toUpperCase()}
            </h1>
          </div>
          <span style={{ fontSize: "13px", padding: "6px 16px", borderRadius: "99px", background: `${statusColor}20`, color: statusColor, fontWeight: 600 }}>
            {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
          </span>
        </div>

        {/* ── Order Tracker ── */}
        <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "32px", marginBottom: "20px" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, marginBottom: "28px" }}>Order Tracking</h2>

          {isCancelled ? (
            <div style={{ textAlign: "center", padding: "24px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>❌</div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "#ef4444", marginBottom: "8px" }}>Order Cancelled</p>
              <p style={{ fontSize: "13px", color: "#B8B5CC" }}>This order has been cancelled.</p>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              {/* progress line background */}
              <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", height: "2px", background: "rgba(255,255,255,0.08)", zIndex: 0 }} />

              {/* progress line fill */}
              <div style={{
                position: "absolute", top: "20px", left: "20px", height: "2px",
                width: currentStep === 0 ? "0%" : `${(currentStep / (STEPS.length - 1)) * 100}%`,
                background: "#FFD600", zIndex: 1, transition: "width 0.5s ease",
                right: "20px",
              }} />

              {/* Steps */}
              <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
                {STEPS.map((step, i) => {
                  const done    = i < currentStep;
                  const active  = i === currentStep;
                  const pending = i > currentStep;

                  return (
                    <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                      {/* Circle */}
                      <div style={{
                        width: "40px", height: "40px", borderRadius: "50%",
                        background: done ? "#FFD600" : active ? "#FFD600" : "rgba(255,255,255,0.06)",
                        border: `2px solid ${done || active ? "#FFD600" : "rgba(255,255,255,0.1)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "16px", marginBottom: "10px",
                        boxShadow: active ? "0 0 16px rgba(255,214,0,0.4)" : "none",
                        transition: "all 0.3s",
                      }}>
                        {done ? "✓" : <span style={{ fontSize: "14px" }}>{STEP_META[step].icon}</span>}
                      </div>

                      {/* Label */}
                      <p style={{
                        fontSize: "11px", fontWeight: active ? 700 : 400, textAlign: "center",
                        color: done || active ? "#fff" : "rgba(255,255,255,0.3)",
                        fontFamily: active ? "'Syne', sans-serif" : "'DM Sans', sans-serif",
                        lineHeight: 1.4,
                      }}>
                        {STEP_META[step].label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Status History */}
          {order.statusHistory?.length > 0 && (
            <div style={{ marginTop: "32px", borderTop: "0.5px solid rgba(255,255,255,0.08)", paddingTop: "24px" }}>
              <p style={{ fontSize: "13px", color: "#B8B5CC", fontWeight: 500, marginBottom: "14px" }}>Status History</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[...order.statusHistory].reverse().map((h, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: STATUS_COLOR[h.status] || "#B8B5CC", flexShrink: 0 }} />
                      <span style={{ textTransform: "capitalize", fontWeight: 500 }}>{h.status}</span>
                      {h.note && <span style={{ color: "#B8B5CC" }}>— {h.note}</span>}
                    </div>
                    <span style={{ color: "#B8B5CC" }}>
                      {new Date(h.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Items Ordered</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                    {item.image ? <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "20px" }}>📦</span>}
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "2px" }}>{item.title}</p>
                    <p style={{ fontSize: "12px", color: "#B8B5CC" }}>Qty: {item.quantity}</p>
                  </div>
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          {/* Shipping */}
          <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Shipping Address</h2>
            <div style={{ fontSize: "13px", color: "#B8B5CC", lineHeight: 1.8 }}>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
              <p>{order.shippingAddress?.pincode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Payment */}
          <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Payment Summary</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#B8B5CC" }}>
                <span>Method</span>
                <span style={{ color: "#fff", textTransform: "uppercase" }}>{order.paymentMethod}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#B8B5CC" }}>
                <span>Status</span>
                <span style={{ color: order.paymentStatus === "paid" ? "#22c55e" : "#FFD600", textTransform: "capitalize" }}>{order.paymentStatus}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#B8B5CC" }}>
                  <span>Discount</span>
                  <span style={{ color: "#22c55e" }}>- ₹{order.discount?.toLocaleString()}</span>
                </div>
              )}
              <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)", paddingTop: "8px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>Total</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#FFD600" }}>₹{order.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
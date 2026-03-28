import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder } from "../redux/slices/orderSlice";

export default function OrderDetail() {
  const { id }    = useParams();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { order, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrder(id));
  }, [id, dispatch]);

  const statusColor = { placed: "#FFD600", confirmed: "#3b82f6", processing: "#f97316", shipped: "#8b5cf6", delivered: "#22c55e", cancelled: "#ef4444" };

  if (loading) return <div style={{ minHeight: "100vh", background: "#0D0B1F", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>Loading...</div>;
  if (!order) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B1F", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: "64px", background: "rgba(13,11,31,0.95)", backdropFilter: "blur(16px)", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
        <span onClick={() => navigate("/")} style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, cursor: "pointer" }}>⚡<span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span></span>
        <button onClick={() => navigate("/orders")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 16px", color: "#fff", cursor: "pointer" }}>← My Orders</button>
      </nav>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800 }}>Order #{order._id?.slice(-8).toUpperCase()}</h1>
          <span style={{ fontSize: "13px", padding: "6px 16px", borderRadius: "99px", background: `${statusColor[order.orderStatus]}20`, color: statusColor[order.orderStatus], fontWeight: 500 }}>
            {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
          </span>
        </div>

        {/* Items */}
        <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Items Ordered</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", overflow: "hidden" }}>
                    {item.image ? <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📦"}
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

          {/* Summary */}
          <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Payment Summary</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#B8B5CC" }}>
                <span>Payment Method</span>
                <span style={{ color: "#fff", textTransform: "uppercase" }}>{order.paymentMethod}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#B8B5CC" }}>
                <span>Payment Status</span>
                <span style={{ color: order.paymentStatus === "paid" ? "#22c55e" : "#FFD600", textTransform: "capitalize" }}>{order.paymentStatus}</span>
              </div>
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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../redux/slices/orderSlice";

export default function Orders() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { orders, loading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    dispatch(fetchMyOrders());
  }, [user, dispatch, navigate]);

  const statusColor = {
    placed:     "#FFD600",
    confirmed:  "#3b82f6",
    processing: "#f97316",
    shipped:    "#8b5cf6",
    delivered:  "#22c55e",
    cancelled:  "#ef4444",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B1F", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: "64px", background: "rgba(13,11,31,0.95)", backdropFilter: "blur(16px)", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
        <span onClick={() => navigate("/")} style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, cursor: "pointer" }}>⚡<span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span></span>
        <button onClick={() => navigate("/products")} style={{ background: "#FFD600", border: "none", borderRadius: "8px", padding: "8px 16px", color: "#0D0B1F", cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Shop More</button>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "32px", fontWeight: 800, marginBottom: "32px" }}>My Orders</h1>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", color: "#B8B5CC" }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>📋</div>
            <p style={{ color: "#B8B5CC", fontSize: "16px", marginBottom: "24px" }}>No orders yet</p>
            <button onClick={() => navigate("/products")} style={{ background: "#FFD600", color: "#0D0B1F", border: "none", borderRadius: "10px", padding: "12px 28px", fontFamily: "'Syne', sans-serif", fontWeight: 700, cursor: "pointer" }}>Start Shopping</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {orders.map((order) => (
              <div key={order._id} onClick={() => navigate(`/orders/${order._id}`)} style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: "#B8B5CC", marginBottom: "4px" }}>Order ID</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 600 }}>#{order._id?.slice(-8).toUpperCase()}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "99px", background: `${statusColor[order.orderStatus]}20`, color: statusColor[order.orderStatus], fontWeight: 500 }}>
                      {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "13px", color: "#B8B5CC" }}>
                    {order.items?.length} item{order.items?.length !== 1 ? "s" : ""} · {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 800, color: "#FFD600" }}>
                    ₹{order.totalAmount?.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
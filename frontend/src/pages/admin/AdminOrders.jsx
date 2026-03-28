import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";

const STATUS_COLORS = { placed: "#FFD600", confirmed: "#3b82f6", processing: "#f97316", shipped: "#8b5cf6", delivered: "#22c55e", cancelled: "#ef4444" };
const STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter]   = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllOrders({ limit: 50, status: filter || undefined });
      setOrders(data.data.orders);
    } catch { toast.error("Failed to load orders"); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const handleStatus = async (id, status) => {
    try {
      await adminService.updateOrderStatus(id, status);
      toast.success("Status updated!");
      load();
    } catch { toast.error("Failed to update status"); }
  };

  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, marginBottom: "4px" }}>Orders</h1>
          <p style={{ color: "#B8B5CC", fontSize: "14px" }}>{orders.length} orders</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 16px", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", outline: "none", cursor: "pointer" }}>
          <option value="">All Status</option>
          {["placed", ...STATUSES].map((s) => <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#B8B5CC" }}>Loading...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#B8B5CC" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
          <p>No orders found</p>
        </div>
      ) : (
        <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
                {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Update Status"].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "12px", color: "#B8B5CC", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "14px 20px", fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 600 }}>#{order._id?.slice(-8).toUpperCase()}</td>
                  <td style={{ padding: "14px 20px", fontSize: "13px" }}>
                    <div>{order.user?.name || "N/A"}</div>
                    <div style={{ fontSize: "11px", color: "#B8B5CC" }}>{order.user?.email}</div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#B8B5CC" }}>{order.items?.length} items</td>
                  <td style={{ padding: "14px 20px", fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#FFD600" }}>₹{order.totalAmount?.toLocaleString()}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "99px", background: order.paymentStatus === "paid" ? "rgba(34,197,94,0.15)" : "rgba(255,214,0,0.15)", color: order.paymentStatus === "paid" ? "#22c55e" : "#FFD600" }}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "99px", background: `${STATUS_COLORS[order.orderStatus]}20`, color: STATUS_COLORS[order.orderStatus] }}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <select onChange={(e) => e.target.value && handleStatus(order._id, e.target.value)} defaultValue="" style={{ background: "#0D0B1F", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "6px 10px", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", outline: "none", cursor: "pointer" }}>
                      <option value="">Update...</option>
                      {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
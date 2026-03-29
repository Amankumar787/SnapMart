import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats]     = useState({ products: 0, orders: 0, revenue: 0, users: 0 });
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, o] = await Promise.all([
          adminService.getProducts({ limit: 1 }),
          adminService.getAllOrders({ limit: 50 }),
        ]);
        const allOrders = o.data.orders || [];
        const revenue   = allOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        setStats({
          products: p.data.pagination?.total || 0,
          orders:   o.data.pagination?.total || 0,
          revenue,
          users: 0,
        });
        setOrders(allOrders);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  // Build last 7 days order data
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-IN", { weekday: "short" });
      const count = orders.filter((o) => {
        const od = new Date(o.createdAt);
        return od.toDateString() === d.toDateString();
      }).length;
      const revenue = orders
        .filter((o) => new Date(o.createdAt).toDateString() === d.toDateString())
        .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
      days.push({ label, count, revenue });
    }
    return days;
  };

  // Order status breakdown
  const getStatusBreakdown = () => {
    const statuses = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    return statuses.map((s) => ({
      label: s,
      count: orders.filter((o) => o.orderStatus === s).length,
      color: { placed: "#FFD600", confirmed: "#3b82f6", processing: "#f97316", shipped: "#8b5cf6", delivered: "#22c55e", cancelled: "#ef4444" }[s],
    })).filter((s) => s.count > 0);
  };

  const days7     = getLast7Days();
  const maxCount  = Math.max(...days7.map((d) => d.count), 1);
  const maxRev    = Math.max(...days7.map((d) => d.revenue), 1);
  const breakdown = getStatusBreakdown();
  const totalOrders = breakdown.reduce((acc, s) => acc + s.count, 0) || 1;

  const statCards = [
    { icon: "📦", label: "Total Products", value: stats.products, color: "#3b82f6",  sub: "in store" },
    { icon: "📋", label: "Total Orders",   value: stats.orders,   color: "#FFD600",  sub: "all time" },
    { icon: "💰", label: "Total Revenue",  value: `₹${stats.revenue.toLocaleString()}`, color: "#22c55e", sub: "all time" },
    { icon: "🚚", label: "Delivered",      value: orders.filter((o) => o.orderStatus === "delivered").length, color: "#8b5cf6", sub: "orders" },
  ];

  return (
    <div style={{ padding: "40px 48px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .bar-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
        .bar-inner { width: 100%; border-radius: 6px 6px 0 0; transition: height 0.5s ease; cursor: pointer; position: relative; }
        .bar-inner:hover { opacity: 0.8; }
        .stat-card { background: #1A1730; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.2s; }
        .stat-card:hover { transform: translateY(-2px); border-color: rgba(255,214,0,0.2); }
      `}</style>

      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, marginBottom: "4px" }}>Dashboard</h1>
      <p style={{ color: "#B8B5CC", marginBottom: "32px", fontSize: "14px" }}>Welcome back — here's what's happening</p>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {statCards.map(({ icon, label, value, color, sub }) => (
          <div key={label} className="stat-card">
            <div style={{ fontSize: "24px", marginBottom: "12px" }}>{icon}</div>
            <p style={{ fontSize: "12px", color: "#B8B5CC", marginBottom: "4px" }}>{label}</p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "24px", fontWeight: 800, color, marginBottom: "2px" }}>{value}</p>
            <p style={{ fontSize: "11px", color: "#B8B5CC" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

        {/* Orders Bar Chart */}
        <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>Orders — last 7 days</h2>
            <p style={{ fontSize: "12px", color: "#B8B5CC" }}>Daily order count</p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "160px" }}>
            {days7.map((day, i) => (
              <div key={i} className="bar-wrap">
                <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                  <div
                    className="bar-inner"
                    style={{
                      height: `${Math.max((day.count / maxCount) * 100, day.count > 0 ? 8 : 2)}%`,
                      background: day.count > 0 ? "linear-gradient(180deg, #FFD600, #F59E0B)" : "rgba(255,255,255,0.06)",
                      minHeight: "4px",
                    }}
                    title={`${day.count} orders`}
                  />
                </div>
                <span style={{ fontSize: "11px", color: "#B8B5CC", whiteSpace: "nowrap" }}>{day.label}</span>
                <span style={{ fontSize: "11px", color: "#FFD600", fontWeight: 600 }}>{day.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>Revenue — last 7 days</h2>
            <p style={{ fontSize: "12px", color: "#B8B5CC" }}>Daily revenue in ₹</p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "160px" }}>
            {days7.map((day, i) => (
              <div key={i} className="bar-wrap">
                <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                  <div
                    className="bar-inner"
                    style={{
                      height: `${Math.max((day.revenue / maxRev) * 100, day.revenue > 0 ? 8 : 2)}%`,
                      background: day.revenue > 0 ? "linear-gradient(180deg, #22c55e, #16a34a)" : "rgba(255,255,255,0.06)",
                      minHeight: "4px",
                    }}
                    title={`₹${day.revenue.toLocaleString()}`}
                  />
                </div>
                <span style={{ fontSize: "11px", color: "#B8B5CC", whiteSpace: "nowrap" }}>{day.label}</span>
                <span style={{ fontSize: "10px", color: "#22c55e", fontWeight: 600 }}>{day.revenue > 0 ? `₹${(day.revenue / 1000).toFixed(1)}k` : "0"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, marginBottom: "20px" }}>Order Status Breakdown</h2>
        {breakdown.length === 0 ? (
          <p style={{ color: "#B8B5CC", fontSize: "14px" }}>No orders yet</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {breakdown.map(({ label, count, color }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", textTransform: "capitalize", color: "#fff" }}>{label}</span>
                  <span style={{ fontSize: "13px", color, fontWeight: 600 }}>{count} ({Math.round((count / totalOrders) * 100)}%)</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "99px", height: "6px", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: "99px", background: color, width: `${(count / totalOrders) * 100}%`, transition: "width 0.5s ease" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {[
          { icon: "📦", label: "Add Product", path: "/admin/products" },
          { icon: "📋", label: "View Orders", path: "/admin/orders" },
          { icon: "🎟️", label: "Add Coupon",  path: "/admin/coupons" },
        ].map(({ icon, label, path }) => (
          <button key={label} onClick={() => navigate(path)} style={{ background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.2)", borderRadius: "12px", padding: "16px", color: "#FFD600", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", transition: "all 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,214,0,0.15)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,214,0,0.08)"}
          >
            {icon} {label}
          </button>
        ))}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [p, o] = await Promise.all([
          adminService.getProducts({ limit: 1 }),
          adminService.getAllOrders({ limit: 1 }),
        ]);
        setStats({
          products: p.data.pagination?.total || 0,
          orders:   o.data.pagination?.total || 0,
        });
      } catch {
        "aaalu"
      }
    };
    load();
  }, []);

  const cards = [
    { icon: "📦", label: "Total Products", value: stats.products, path: "/admin/products", color: "#3b82f6" },
    { icon: "📋", label: "Total Orders",   value: stats.orders,   path: "/admin/orders",   color: "#FFD600" },
    { icon: "📦", label: "Manage Products",value: "→",            path: "/admin/products", color: "#8b5cf6" },
    { icon: "🎟️", label: "Manage Coupons", value: "→",            path: "/admin/coupons",  color: "#22c55e" },
  ];

  return (
    <div style={{ padding: "40px 48px" }}>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Dashboard</h1>
      <p style={{ color: "#B8B5CC", marginBottom: "40px", fontSize: "14px" }}>Welcome to SnapMart Admin Panel</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "40px" }}>
        {cards.map(({ icon, label, value, path, color }) => (
          <div key={label} onClick={() => navigate(path)} style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,214,0,0.3)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
          >
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>{icon}</div>
            <p style={{ fontSize: "12px", color: "#B8B5CC", marginBottom: "4px" }}>{label}</p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, color }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {[
          { icon: "📦", label: "Add Product",  path: "/admin/products" },
          { icon: "📋", label: "View Orders",  path: "/admin/orders" },
          { icon: "🎟️", label: "Add Coupon",   path: "/admin/coupons" },
        ].map(({ icon, label, path }) => (
          <button key={label} onClick={() => navigate(path)} style={{ background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.2)", borderRadius: "12px", padding: "16px", color: "#FFD600", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
            {icon} {label}
          </button>
        ))}
      </div>
    </div>
  );
}
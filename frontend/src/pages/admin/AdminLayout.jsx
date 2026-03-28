import { useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const { user }  = useSelector((state) => state.auth);
  const navigate  = useNavigate();
  const location  = useLocation();

  if (!user || !["admin", "superadmin"].includes(user.role)) {
    navigate("/"); return null;
  }

  const links = [
    { icon: "📊", label: "Dashboard",  path: "/admin" },
    { icon: "📦", label: "Products",   path: "/admin/products" },
    { icon: "📋", label: "Orders",     path: "/admin/orders" },
    { icon: "👥", label: "Users",      path: "/admin/users" },
    { icon: "🎟️", label: "Coupons",    path: "/admin/coupons" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0D0B1F", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      {/* Sidebar */}
      <aside style={{ width: "240px", background: "#1A1730", borderRight: "0.5px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", padding: "24px 16px", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 800, cursor: "pointer", marginBottom: "32px", padding: "0 8px" }}>
          ⚡<span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span>
          <span style={{ fontSize: "10px", background: "rgba(255,214,0,0.15)", color: "#FFD600", padding: "2px 8px", borderRadius: "99px", marginLeft: "4px" }}>Admin</span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {links.map(({ icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <div key={path} onClick={() => navigate(path)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s", background: active ? "rgba(255,214,0,0.1)" : "transparent", color: active ? "#FFD600" : "#B8B5CC", fontWeight: active ? 500 : 400, fontSize: "14px" }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: "16px" }}>{icon}</span>
                {label}
              </div>
            );
          })}
        </nav>

        <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,214,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#FFD600" }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 500 }}>{user.name}</p>
              <p style={{ fontSize: "11px", color: "#B8B5CC", textTransform: "capitalize" }}>{user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
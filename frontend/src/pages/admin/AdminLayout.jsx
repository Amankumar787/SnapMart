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
  // { icon: "👤", label: "Profile",    path: "/admin/profile" },
];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0D0B1F", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      {/* Sidebar */}
      <aside style={{ width: "240px", background: "#1A1730", borderRight: "0.5px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", padding: "24px 16px", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
       <div onClick={() => navigate("/")} style={{ cursor: "pointer", marginBottom: "32px", padding: "0 8px" }}>
  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
    <span>⚡</span>
    <span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span>
  </div>
  <span style={{ fontSize: "10px", background: "rgba(255,214,0,0.15)", color: "#FFD600", padding: "2px 10px", borderRadius: "99px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: "0.5px" }}>Admin</span>
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
  <div
    onClick={() => navigate("/admin/profile")}
    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s", marginBottom: "8px" }}
    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
  >
    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,214,0,0.15)", border: "1px solid rgba(255,214,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 700, color: "#FFD600", flexShrink: 0 }}>
      {user.name?.[0]?.toUpperCase()}
    </div>
    <div>
      <p style={{ fontSize: "13px", fontWeight: 500, color: "#fff" }}>{user.name}</p>
      <p style={{ fontSize: "11px", color: "#B8B5CC", textTransform: "capitalize" }}>{user.role}</p>
    </div>
    <svg style={{ marginLeft: "auto" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8B5CC" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
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
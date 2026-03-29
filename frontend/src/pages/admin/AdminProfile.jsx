import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

export default function AdminProfile() {
  const { user }  = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px 48px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, marginBottom: "32px" }}>My Profile</h1>

      {/* Profile Card */}
      <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "36px", marginBottom: "20px", maxWidth: "560px" }}>
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,214,0,0.15)", border: "2px solid rgba(255,214,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: "32px", fontWeight: 800, color: "#FFD600" }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>{user?.name}</h2>
            <span style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "99px", background: "rgba(255,214,0,0.12)", color: "#FFD600", fontWeight: 500, textTransform: "capitalize" }}>{user?.role}</span>
          </div>
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {[
            { label: "Full Name",  value: user?.name },
            { label: "Email",      value: user?.email },
            { label: "Role",       value: user?.role },
            { label: "Account ID", value: `#${user?._id?.slice(-8).toUpperCase()}` },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: "13px", color: "#B8B5CC" }}>{label}</span>
              <span style={{ fontSize: "13px", fontWeight: 500, textTransform: "capitalize" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px", maxWidth: "560px" }}>
        {[
          { icon: "📦", label: "Products",  path: "/admin/products" },
          { icon: "📋", label: "Orders",    path: "/admin/orders" },
          { icon: "👥", label: "Users",     path: "/admin/users" },
        ].map(({ icon, label, path }) => (
          <button key={label} onClick={() => navigate(path)} style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", transition: "all 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,214,0,0.3)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Logout */}
      <button onClick={handleLogout} style={{ width: "100%", maxWidth: "560px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "14px", color: "#ef4444", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, transition: "all 0.2s" }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
      >
        Sign Out
      </button>
    </div>
  );
}
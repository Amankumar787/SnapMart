import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

export default function Profile() {
  const { user }  = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully!");
    navigate("/");
  };

  if (!user) { navigate("/login"); return null; }

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B1F", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: "64px", background: "rgba(13,11,31,0.95)", backdropFilter: "blur(16px)", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
        <span onClick={() => navigate("/")} style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, cursor: "pointer" }}>⚡<span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span></span>
        <button onClick={() => navigate("/orders")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 16px", color: "#fff", cursor: "pointer" }}>My Orders</button>
      </nav>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "32px", fontWeight: 800, marginBottom: "32px" }}>My Profile</h1>

        <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "36px", marginBottom: "20px" }}>
          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(255,214,0,0.15)", border: "2px solid rgba(255,214,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, color: "#FFD600" }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>{user.name}</h2>
              <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "99px", background: "rgba(255,214,0,0.12)", color: "#FFD600", fontWeight: 500, textTransform: "capitalize" }}>{user.role}</span>
            </div>
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Email",  value: user.email },
              { label: "Role",   value: user.role },
              { label: "Member since", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "N/A" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "13px", color: "#B8B5CC" }}>{label}</span>
                <span style={{ fontSize: "13px", fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <button onClick={() => navigate("/orders")} style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", textAlign: "left" }}>
            📋 My Orders
          </button>
          <button onClick={() => navigate("/cart")} style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", textAlign: "left" }}>
            🛒 My Cart
          </button>
        </div>

        <button onClick={handleLogout} style={{ width: "100%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "14px", color: "#ef4444", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700 }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
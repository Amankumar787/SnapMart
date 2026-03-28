import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/users");
        setUsers(data.data.users);
      } catch { toast.error("Failed to load users"); }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, marginBottom: "4px" }}>Users</h1>
        <p style={{ color: "#B8B5CC", fontSize: "14px" }}>{users.length} registered users</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#B8B5CC" }}>Loading...</div>
      ) : (
        <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
                {["User", "Email", "Role", "Status", "Joined"].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "12px", color: "#B8B5CC", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,214,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#FFD600", flexShrink: 0 }}>
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#B8B5CC" }}>{user.email}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "99px", background: user.role === "admin" || user.role === "superadmin" ? "rgba(255,214,0,0.15)" : "rgba(255,255,255,0.06)", color: user.role === "admin" || user.role === "superadmin" ? "#FFD600" : "#B8B5CC", textTransform: "capitalize" }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "99px", background: user.isActive ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: user.isActive ? "#22c55e" : "#ef4444" }}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#B8B5CC" }}>
                    {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
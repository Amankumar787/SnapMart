import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Please fill all fields");
    dispatch(loginUser(form));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B1F", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .auth-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 13px 16px; font-size: 14px; color: #fff; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
        .auth-input:focus { border-color: rgba(255,214,0,0.5); }
        .auth-input::placeholder { color: rgba(255,255,255,0.3); }
        .auth-btn { width: 100%; background: #FFD600; color: #0D0B1F; border: none; border-radius: 10px; padding: 14px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .auth-btn:hover { background: #FFC107; transform: translateY(-1px); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(59,47,217,0.4) 0%, transparent 70%), radial-gradient(ellipse 60% 60% at 70% 60%, rgba(124,58,237,0.3) 0%, transparent 60%)", zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "420px", animation: "fadeUp 0.5s ease both" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none", fontFamily: "'Syne', sans-serif", fontSize: "24px", fontWeight: 800, color: "#fff" }}>
            <span style={{ fontSize: "26px" }}>⚡</span>
            <span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span>
          </Link>
          <p style={{ marginTop: "8px", fontSize: "14px", color: "#B8B5CC" }}>Welcome back! Sign in to continue.</p>
        </div>

        {/* Card */}
        <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "36px" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 700, marginBottom: "24px", color: "#fff" }}>Sign in</h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "#B8B5CC", marginBottom: "6px", display: "block" }}>Email</label>
              <input className="auth-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "#B8B5CC", marginBottom: "6px", display: "block" }}>Password</label>
              <input className="auth-input" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
            </div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p style={{ marginTop: "20px", textAlign: "center", fontSize: "13px", color: "#B8B5CC" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#FFD600", textDecoration: "none", fontWeight: 500 }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
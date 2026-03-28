import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";

const EMPTY = { code: "", discountType: "percentage", value: "", minOrderAmount: "", maxDiscount: "", expiryDate: "", usageLimit: "1" };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY);

  const load = async () => {
    try {
      const data = await adminService.getCoupons();
      setCoupons(data.data.coupons);
    } catch { toast.error("Failed to load coupons"); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createCoupon({ ...form, value: Number(form.value), minOrderAmount: Number(form.minOrderAmount) || 0, maxDiscount: Number(form.maxDiscount) || undefined, usageLimit: Number(form.usageLimit) });
      toast.success("Coupon created!");
      setShowForm(false); setForm(EMPTY); load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try { await adminService.deleteCoupon(id); toast.success("Deleted!"); load(); }
    catch { toast.error("Failed to delete"); }
  };

  return (
    <div style={{ padding: "40px 48px" }}>
      <style>{`
        .admin-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 14px; font-size: 14px; color: #fff; font-family: 'DM Sans', sans-serif; outline: none; }
        .admin-input:focus { border-color: rgba(255,214,0,0.5); }
        .admin-select { width: 100%; background: #1A1730; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 14px; font-size: 14px; color: #fff; font-family: 'DM Sans', sans-serif; outline: none; cursor: pointer; }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, marginBottom: "4px" }}>Coupons</h1>
          <p style={{ color: "#B8B5CC", fontSize: "14px" }}>{coupons.length} coupons</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: "#FFD600", color: "#0D0B1F", border: "none", borderRadius: "10px", padding: "10px 20px", fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
          + Add Coupon
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "480px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>Create Coupon</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { key: "code",           label: "Coupon Code",      placeholder: "SAVE50" },
                { key: "value",          label: "Discount Value",   placeholder: "50", type: "number" },
                { key: "minOrderAmount", label: "Min Order (₹)",    placeholder: "0", type: "number" },
                { key: "maxDiscount",    label: "Max Discount (₹)", placeholder: "Optional", type: "number" },
                { key: "usageLimit",     label: "Usage Limit",      placeholder: "1", type: "number" },
                { key: "expiryDate",     label: "Expiry Date",      type: "date" },
              ].map(({ key, label, placeholder, type = "text" }) => (
                <div key={key}>
                  <label style={{ fontSize: "12px", color: "#B8B5CC", marginBottom: "6px", display: "block" }}>{label}</label>
                  <input className="admin-input" type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: "12px", color: "#B8B5CC", marginBottom: "6px", display: "block" }}>Discount Type</label>
                <select className="admin-select" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (₹)</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY); }} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px", color: "#fff", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 1, background: "#FFD600", color: "#0D0B1F", border: "none", borderRadius: "10px", padding: "12px", fontFamily: "'Syne', sans-serif", fontWeight: 700, cursor: "pointer" }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupons Table */}
      {coupons.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#B8B5CC" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎟️</div>
          <p>No coupons yet</p>
        </div>
      ) : (
        <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
                {["Code", "Type", "Value", "Min Order", "Usage", "Expiry", "Status", ""].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "12px", color: "#B8B5CC", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "14px 20px", fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "#FFD600" }}>{coupon.code}</td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#B8B5CC", textTransform: "capitalize" }}>{coupon.discountType}</td>
                  <td style={{ padding: "14px 20px", fontSize: "13px" }}>{coupon.discountType === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}</td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#B8B5CC" }}>₹{coupon.minOrderAmount}</td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#B8B5CC" }}>{coupon.usedCount}/{coupon.usageLimit}</td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#B8B5CC" }}>{new Date(coupon.expiryDate).toLocaleDateString("en-IN")}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "99px", background: coupon.isActive ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: coupon.isActive ? "#22c55e" : "#ef4444" }}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <button onClick={() => handleDelete(coupon._id)} style={{ background: "rgba(239,68,68,0.15)", border: "none", borderRadius: "6px", padding: "6px 12px", color: "#ef4444", cursor: "pointer", fontSize: "12px" }}>Delete</button>
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
import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";

const EMPTY = { title: "", description: "", price: "", category: "", brand: "", stock: "", discountPrice: "" };
const CATEGORIES = ["Electronics", "Fashion", "Home & Living", "Beauty", "Mobiles", "Gaming", "Sports", "Books"];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [images, setImages]     = useState([]); // 👈 new
  const [previews, setPreviews] = useState([]); // 👈 new

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getProducts({ limit: 50 });
      setProducts(data.data.products);
    } catch { toast.error("Failed to load products"); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // 👇 handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 👇 use FormData so files can be sent
      const formData = new FormData();
      formData.append("title",         form.title);
      formData.append("description",   form.description);
      formData.append("price",         Number(form.price));
      formData.append("stock",         Number(form.stock));
      formData.append("category",      form.category);
      formData.append("brand",         form.brand);
      if (form.discountPrice) formData.append("discountPrice", Number(form.discountPrice));
      images.forEach((img) => formData.append("images", img));

      if (editing) {
        await adminService.updateProduct(editing, formData);
        toast.success("Product updated!");
      } else {
        await adminService.createProduct(formData);
        toast.success("Product created!");
      }
      setShowForm(false); setEditing(null); setForm(EMPTY);
      setImages([]); setPreviews([]);
      load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleEdit = (product) => {
    setForm({
      title: product.title, description: product.description,
      price: product.price, category: product.category,
      brand: product.brand || "", stock: product.stock,
      discountPrice: product.discountPrice || ""
    });
    setPreviews(product.images?.map((img) => img.url) || []);
    setImages([]);
    setEditing(product._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await adminService.deleteProduct(id); toast.success("Deleted!"); load(); }
    catch { toast.error("Failed to delete"); }
  };

  return (
    <div style={{ padding: "40px 48px" }}>
      <style>{`
        .admin-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 14px; font-size: 14px; color: #fff; font-family: 'DM Sans', sans-serif; outline: none; box-sizing: border-box; }
        .admin-input:focus { border-color: rgba(255,214,0,0.5); }
        .admin-input::placeholder { color: rgba(255,255,255,0.3); }
        .admin-select { width: 100%; background: #1A1730; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 14px; font-size: 14px; color: #fff; font-family: 'DM Sans', sans-serif; outline: none; cursor: pointer; }
        .upload-box { width: 100%; border: 1.5px dashed rgba(255,255,255,0.15); border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; color: #B8B5CC; font-size: 13px; transition: border-color 0.2s; box-sizing: border-box; }
        .upload-box:hover { border-color: rgba(255,214,0,0.4); }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, marginBottom: "4px" }}>Products</h1>
          <p style={{ color: "#B8B5CC", fontSize: "14px" }}>{products.length} total products</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY); setImages([]); setPreviews([]); }}
          style={{ background: "#FFD600", color: "#0D0B1F", border: "none", borderRadius: "10px", padding: "10px 20px", fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
          + Add Product
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>{editing ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Image Upload */}
              <div>
                <label style={{ fontSize: "12px", color: "#B8B5CC", marginBottom: "6px", display: "block" }}>Product Images</label>
                <label className="upload-box">
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: "none" }} />
                  {previews.length === 0
                    ? <span>Click to upload images (max 5)</span>
                    : <span>{previews.length} image(s) selected</span>
                  }
                </label>
                {/* Image Previews */}
                {previews.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                    {previews.map((src, i) => (
                      <img key={i} src={src} alt="" style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} />
                    ))}
                  </div>
                )}
              </div>

              {[
                { key: "title",         label: "Title",     placeholder: "Product name" },
                { key: "brand",         label: "Brand",     placeholder: "Brand name" },
                { key: "price",         label: "Price (₹)", placeholder: "0", type: "number" },
                { key: "discountPrice", label: "MRP (₹)",   placeholder: "Original price", type: "number" },
                { key: "stock",         label: "Stock",     placeholder: "0", type: "number" },
              ].map(({ key, label, placeholder, type = "text" }) => (
                <div key={key}>
                  <label style={{ fontSize: "12px", color: "#B8B5CC", marginBottom: "6px", display: "block" }}>{label}</label>
                  <input className="admin-input" type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}

              <div>
                <label style={{ fontSize: "12px", color: "#B8B5CC", marginBottom: "6px", display: "block" }}>Category</label>
                <select className="admin-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#B8B5CC", marginBottom: "6px", display: "block" }}>Description</label>
                <textarea className="admin-input" rows={3} placeholder="Product description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "none" }} />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); setImages([]); setPreviews([]); }}
                  style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px", color: "#fff", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>Cancel</button>
                <button type="submit"
                  style={{ flex: 1, background: "#FFD600", color: "#0D0B1F", border: "none", borderRadius: "10px", padding: "12px", fontFamily: "'Syne', sans-serif", fontWeight: 700, cursor: "pointer" }}>{editing ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#B8B5CC" }}>Loading...</div>
      ) : (
        <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
                {["Image", "Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "12px", color: "#B8B5CC", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>

                  {/* 👇 image column */}
                  <td style={{ padding: "14px 20px" }}>
                    {product.images?.[0]?.url
                      ? <img src={product.images[0].url} alt={product.title} style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "8px" }} />
                      : <div style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📦</div>
                    }
                  </td>

                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>{product.title}</div>
                    <div style={{ fontSize: "12px", color: "#B8B5CC" }}>{product.brand}</div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#B8B5CC" }}>{product.category}</td>
                  <td style={{ padding: "14px 20px", fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 600, color: "#FFD600" }}>₹{product.price?.toLocaleString()}</td>
                  <td style={{ padding: "14px 20px", fontSize: "13px" }}>{product.stock}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "99px", background: product.isActive ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: product.isActive ? "#22c55e" : "#ef4444" }}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleEdit(product)} style={{ background: "rgba(59,130,246,0.15)", border: "none", borderRadius: "6px", padding: "6px 12px", color: "#3b82f6", cursor: "pointer", fontSize: "12px" }}>Edit</button>
                      <button onClick={() => handleDelete(product._id)} style={{ background: "rgba(239,68,68,0.15)", border: "none", borderRadius: "6px", padding: "6px 12px", color: "#ef4444", cursor: "pointer", fontSize: "12px" }}>Delete</button>
                    </div>
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

export default function Products() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { products, loading, pagination } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({ keyword: "", category: "", sort: "newest", page: 1 });

  const categories = ["Electronics", "Fashion", "Home & Living", "Beauty", "Mobiles", "Gaming", "Sports", "Books"];

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [filters, dispatch]);

  const handleAddToCart = (productId) => {
    if (!user) { toast.error("Please login to add to cart"); navigate("/login"); return; }
    dispatch(addToCart({ productId, quantity: 1 }));
    toast.success("Added to cart!");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B1F", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .filter-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 99px; padding: 6px 16px; font-size: 13px; color: #B8B5CC; cursor: pointer; transition: all 0.2s; white-space: nowrap; font-family: 'DM Sans', sans-serif; }
        .filter-btn:hover, .filter-btn.active { background: rgba(255,214,0,0.12); border-color: rgba(255,214,0,0.35); color: #FFD600; }
        .product-card { background: #1A1730; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; transition: all 0.2s; cursor: pointer; }
        .product-card:hover { transform: translateY(-4px); border-color: rgba(255,214,0,0.2); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .add-cart-btn { width: 100%; background: #FFD600; color: #0D0B1F; border: none; border-radius: 8px; padding: 10px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .add-cart-btn:hover { background: #FFC107; }
        .search-input { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 16px; font-size: 14px; color: #fff; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; width: 100%; max-width: 320px; }
        .search-input:focus { border-color: rgba(255,214,0,0.5); }
        .search-input::placeholder { color: rgba(255,255,255,0.3); }
        .select-input { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 16px; font-size: 13px; color: #fff; font-family: 'DM Sans', sans-serif; outline: none; cursor: pointer; }
        .select-input option { background: #1A1730; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: "64px", background: "rgba(13,11,31,0.95)", backdropFilter: "blur(16px)", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
        <span onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, color: "#fff", cursor: "pointer" }}>
          <span>⚡</span><span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span>
        </span>
        <div style={{ display: "flex", gap: "12px" }}>
          {user ? (
            <>
              <button onClick={() => navigate("/cart")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 16px", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cart</button>
              <button onClick={() => navigate("/orders")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 16px", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Orders</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 20px", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Login</button>
              <button onClick={() => navigate("/register")} style={{ background: "#FFD600", border: "none", borderRadius: "8px", padding: "8px 20px", color: "#0D0B1F", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Register</button>
            </>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 48px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "36px", fontWeight: 800, marginBottom: "8px" }}>All Products</h1>
          <p style={{ color: "#B8B5CC", fontSize: "14px" }}>{pagination?.total || 0} products found</p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
          <input className="search-input" placeholder="Search products..." value={filters.keyword} onChange={(e) => setFilters({ ...filters, keyword: e.target.value, page: 1 })} />
          <select className="select-input" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="top_rated">Top Rated</option>
          </select>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
          <button className={`filter-btn${!filters.category ? " active" : ""}`} onClick={() => setFilters({ ...filters, category: "", page: 1 })}>All</button>
          {categories.map((cat) => (
            <button key={cat} className={`filter-btn${filters.category === cat ? " active" : ""}`} onClick={() => setFilters({ ...filters, category: cat, page: 1 })}>{cat}</button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", color: "#B8B5CC" }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
            <p style={{ color: "#B8B5CC", fontSize: "16px" }}>No products found</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {products.map((product) => (
              <div key={product._id} className="product-card">
                {/* Image */}
                <div onClick={() => navigate(`/products/${product._id}`)} style={{ height: "200px", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {product.images?.[0]?.url ? (
                    <img src={product.images[0].url} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ fontSize: "48px" }}>📦</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "16px" }}>
                  <div style={{ fontSize: "11px", color: "#FFD600", marginBottom: "6px", fontWeight: 500 }}>{product.category}</div>
                  <h3 onClick={() => navigate(`/products/${product._id}`)} style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 600, marginBottom: "8px", lineHeight: 1.3, cursor: "pointer" }}>{product.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
                    <span style={{ color: "#FFD600", fontSize: "12px" }}>★</span>
                    <span style={{ fontSize: "12px", color: "#B8B5CC" }}>{product.ratings?.toFixed(1) || "0.0"} ({product.numReviews || 0})</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "#FFD600" }}>₹{product.price?.toLocaleString()}</span>
                      {product.discountPrice && <span style={{ fontSize: "12px", color: "#B8B5CC", textDecoration: "line-through", marginLeft: "8px" }}>₹{product.discountPrice?.toLocaleString()}</span>}
                    </div>
                    <span style={{ fontSize: "11px", color: product.stock > 0 ? "#22c55e" : "#ef4444" }}>{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
                  </div>
                  <button className="add-cart-btn" onClick={() => handleAddToCart(product._id)} disabled={product.stock === 0}>
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "40px" }}>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setFilters({ ...filters, page })} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: filters.page === page ? "#FFD600" : "transparent", color: filters.page === page ? "#0D0B1F" : "#fff", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>{page}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct, clearProduct } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import productService from "../services/productService";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { product, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [qty, setQty]       = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    dispatch(fetchProduct(id));
    return () => dispatch(clearProduct());
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (!user) { toast.error("Please login to add to cart"); navigate("/login"); return; }
    dispatch(addToCart({ productId: id, quantity: qty }));
    toast.success("Added to cart!");
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to review"); return; }
    try {
      await productService.addReview(id, review);
      toast.success("Review added!");
      dispatch(fetchProduct(id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    }
  };

  if (loading) return <div style={{ minHeight: "100vh", background: "#0D0B1F", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>Loading...</div>;
  if (!product) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B1F", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .qty-btn { width: 32px; height: 32px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .qty-btn:hover { background: rgba(255,255,255,0.12); }
        .review-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 16px; font-size: 14px; color: #fff; font-family: 'DM Sans', sans-serif; outline: none; resize: none; }
        .review-input:focus { border-color: rgba(255,214,0,0.5); }
        .thumb { width: 64px; height: 64px; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }
        .thumb.active { border-color: #FFD600; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: "64px", background: "rgba(13,11,31,0.95)", backdropFilter: "blur(16px)", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
        <span onClick={() => navigate("/")} style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, cursor: "pointer" }}>
          ⚡<span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span>
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => navigate("/products")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 16px", color: "#fff", cursor: "pointer" }}>← Products</button>
          <button onClick={() => navigate("/cart")} style={{ background: "#FFD600", border: "none", borderRadius: "8px", padding: "8px 16px", color: "#0D0B1F", cursor: "pointer", fontWeight: 600 }}>Cart</button>
        </div>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", marginBottom: "60px" }}>
          {/* Images */}
          <div>
            <div style={{ background: "#1A1730", borderRadius: "16px", overflow: "hidden", height: "380px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
              {product.images?.[activeImg]?.url ? (
                <img src={product.images[activeImg].url} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ fontSize: "80px" }}>📦</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: "flex", gap: "8px" }}>
                {product.images.map((img, i) => (
                  <div key={i} className={`thumb${activeImg === i ? " active" : ""}`} onClick={() => setActiveImg(i)}>
                    <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "12px", color: "#FFD600", marginBottom: "8px", fontWeight: 500 }}>{product.category} {product.brand && `· ${product.brand}`}</div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, lineHeight: 1.2, marginBottom: "12px" }}>{product.title}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {[1,2,3,4,5].map((star) => (
                  <span key={star} style={{ color: star <= Math.round(product.ratings) ? "#FFD600" : "#333", fontSize: "16px" }}>★</span>
                ))}
                <span style={{ fontSize: "13px", color: "#B8B5CC" }}>({product.numReviews} reviews)</span>
              </div>
            </div>

            <div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "36px", fontWeight: 800, color: "#FFD600" }}>₹{product.price?.toLocaleString()}</span>
              {product.discountPrice && <span style={{ fontSize: "16px", color: "#B8B5CC", textDecoration: "line-through", marginLeft: "12px" }}>₹{product.discountPrice?.toLocaleString()}</span>}
            </div>

            <p style={{ color: "#B8B5CC", lineHeight: 1.7, fontSize: "14px" }}>{product.description}</p>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "#B8B5CC" }}>Stock:</span>
              <span style={{ fontSize: "13px", color: product.stock > 0 ? "#22c55e" : "#ef4444", fontWeight: 500 }}>{product.stock > 0 ? `${product.stock} available` : "Out of stock"}</span>
            </div>

            {/* Qty + Add to Cart */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "8px 16px" }}>
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, minWidth: "24px", textAlign: "center" }}>{qty}</span>
                <button className="qty-btn" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
              </div>
              <button onClick={handleAddToCart} disabled={product.stock === 0} style={{ flex: 1, background: "#FFD600", color: "#0D0B1F", border: "none", borderRadius: "10px", padding: "14px", fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, cursor: product.stock === 0 ? "not-allowed" : "pointer", opacity: product.stock === 0 ? 0.5 : 1 }}>
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "32px" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 700, marginBottom: "24px" }}>Reviews</h2>

          {/* Add Review */}
          {user && (
            <form onSubmit={handleReview} style={{ marginBottom: "32px", paddingBottom: "32px", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 500, marginBottom: "16px" }}>Write a review</h3>
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                {[1,2,3,4,5].map((star) => (
                  <span key={star} onClick={() => setReview({ ...review, rating: star })} style={{ fontSize: "24px", cursor: "pointer", color: star <= review.rating ? "#FFD600" : "#333" }}>★</span>
                ))}
              </div>
              <textarea className="review-input" rows={3} placeholder="Share your experience..." value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
              <button type="submit" style={{ marginTop: "12px", background: "#FFD600", color: "#0D0B1F", border: "none", borderRadius: "8px", padding: "10px 24px", fontFamily: "'Syne', sans-serif", fontWeight: 700, cursor: "pointer" }}>Submit Review</button>
            </form>
          )}

          {/* Review List */}
          {product.reviews?.length === 0 ? (
            <p style={{ color: "#B8B5CC", fontSize: "14px" }}>No reviews yet. Be the first to review!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {product.reviews?.map((r, i) => (
                <div key={i} style={{ paddingBottom: "16px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,214,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, color: "#FFD600" }}>
                      {r.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 500 }}>{r.user?.name || "User"}</span>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[1,2,3,4,5].map((star) => <span key={star} style={{ fontSize: "12px", color: star <= r.rating ? "#FFD600" : "#333" }}>★</span>)}
                    </div>
                  </div>
                  <p style={{ fontSize: "13px", color: "#B8B5CC", lineHeight: 1.6 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
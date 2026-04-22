import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

export default function Home() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { user }  = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  //const [activeCategory, setActiveCategory] = useState("Electronics");
  const [timer, setTimer] = useState({ h: 4, m: 23, s: 51 });

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8, sort: "newest" }));
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) h = 0;
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  const categories = [
    { icon: "⚡", name: "Electronics" },
    { icon: "👗", name: "Fashion" },
    { icon: "🏠", name: "Home & Living" },
    { icon: "💄", name: "Beauty" },
    { icon: "📱", name: "Mobiles" },
    { icon: "🎮", name: "Gaming" },
    { icon: "🏋️", name: "Sports" },
    { icon: "📚", name: "Books" },
  ];

  const features = [
    { icon: "⚡", title: "Lightning Fast Delivery", desc: "Get your orders delivered within 24 hours anywhere in India." },
    { icon: "🔒", title: "Secure Payments", desc: "100% secure payments with Stripe encryption and buyer protection." },
    { icon: "↩️", title: "Easy Returns", desc: "Hassle-free 30-day return policy on all products." },
    { icon: "🎧", title: "24/7 Support", desc: "Round the clock customer support to help you with any issue." },
  ];

  const handleAddToCart = (productId) => {
    if (!user) { toast.error("Please login to add to cart"); navigate("/login"); return; }
    dispatch(addToCart({ productId, quantity: 1 }));
    toast.success("Added to cart!");
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0D0B1F", color: "#fff", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        .nav-link { font-size: 14px; color: #B8B5CC; text-decoration: none; transition: color 0.2s; cursor: pointer; }
        .nav-link:hover { color: #fff; }
        .btn-ghost { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #fff; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 20px; cursor: pointer; transition: all 0.2s; }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.06); }
        .btn-primary { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #0D0B1F; background: #FFD600; border: none; border-radius: 8px; padding: 8px 20px; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #FFC107; transform: translateY(-1px); }
        .hero-search-wrap { display: flex; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; backdrop-filter: blur(8px); transition: border-color 0.2s; }
        .hero-search-wrap:focus-within { border-color: rgba(255,214,0,0.5); }
        .hero-search-input { flex: 1; background: transparent; border: none; outline: none; padding: 14px 18px; font-size: 14px; color: #fff; font-family: 'DM Sans', sans-serif; }
        .hero-search-input::placeholder { color: rgba(255,255,255,0.35); }
        .search-btn { background: #FFD600; border: none; cursor: pointer; padding: 12px 24px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #0D0B1F; transition: background 0.2s; }
        .search-btn:hover { background: #FFC107; }
        .cta-main { display: flex; align-items: center; gap: 8px; background: #FFD600; color: #0D0B1F; border: none; border-radius: 10px; padding: 14px 28px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .cta-main:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,214,0,0.35); }
        .cta-secondary { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 14px 28px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .cta-secondary:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.25); }
        .sale-card { background: #1A1730; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 48px 40px; text-align: center; position: relative; overflow: hidden; width: 300px; box-shadow: 0 40px 80px rgba(0,0,0,0.5); animation: float 4s ease-in-out infinite; }
        .cat-pill { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 99px; padding: 7px 16px; font-size: 13px; color: #B8B5CC; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .cat-pill:hover, .cat-pill.active { background: rgba(255,214,0,0.12); border-color: rgba(255,214,0,0.35); color: #FFD600; }
        .cart-icon { position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; transition: all 0.2s; }
        .cart-icon:hover { border-color: rgba(255,255,255,0.3); }
        .product-card { background: #1A1730; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; transition: all 0.2s; cursor: pointer; }
        .product-card:hover { transform: translateY(-4px); border-color: rgba(255,214,0,0.2); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .add-cart-btn { width: 100%; background: #FFD600; color: #0D0B1F; border: none; border-radius: 8px; padding: 10px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .add-cart-btn:hover { background: #FFC107; }
        .feature-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 28px; transition: all 0.2s; }
        .feature-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,214,0,0.2); transform: translateY(-2px); }
        .cat-card { background: #1A1730; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 28px 20px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .cat-card:hover { border-color: rgba(255,214,0,0.3); transform: translateY(-3px); background: rgba(255,214,0,0.05); }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .anim-1 { animation: fadeUp 0.5s 0.0s ease both; }
        .anim-2 { animation: fadeUp 0.5s 0.1s ease both; }
        .anim-3 { animation: fadeUp 0.5s 0.2s ease both; }
        .anim-4 { animation: fadeUp 0.5s 0.3s ease both; }
        .anim-5 { animation: fadeUp 0.5s 0.4s ease both; }
        .anim-6 { animation: fadeUp 0.5s 0.5s ease both; }
        .timer-dot { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; display: inline-block; animation: pulse 1s infinite; margin-right: 6px; }
        .section-title { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; margin-bottom: 8px; }
        .section-sub { color: #B8B5CC; font-size: 15px; margin-bottom: 40px; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: "64px", background: "rgba(13,11,31,0.85)", backdropFilter: "blur(16px)", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
        <span onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, color: "#fff", cursor: "pointer", letterSpacing: "-0.5px" }}>
          <span style={{ fontSize: "22px" }}>⚡</span>
          <span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span>
        </span>
        <ul style={{ display: "flex", alignItems: "center", gap: "36px", listStyle: "none" }}>
          {[["Home", "/"], ["Products", "/products"], ["Orders", "/orders"]].map(([label, path]) => (
            <li key={label}><span className="nav-link" onClick={() => navigate(path)}>{label}</span></li>
          ))}
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="cart-icon" onClick={() => navigate("/cart")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {items.length > 0 && (
              <div style={{ position: "absolute", top: "-5px", right: "-5px", width: "16px", height: "16px", borderRadius: "50%", background: "#FFD600", color: "#0D0B1F", fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{items.length}</div>
            )}
          </div>
          {user ? (
            <button className="btn-ghost" onClick={() => navigate("/profile")}>{user.name.split(" ")[0]}</button>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => navigate("/login")}>Login</button>
              <button className="btn-primary" onClick={() => navigate("/register")}>Register</button>
            </>
          )}
        </div>
      </nav>

      {/* ── SECTION 1: HERO ── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "64px 48px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 20% 50%, rgba(59,47,217,0.55) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 30%, rgba(124,58,237,0.4) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 60% 80%, rgba(91,78,245,0.3) 0%, transparent 60%)`, zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "40px 40px", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div className="anim-1" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,214,0,0.12)", border: "1px solid rgba(255,214,0,0.25)", borderRadius: "99px", padding: "6px 14px", fontSize: "12px", fontWeight: 500, color: "#FFD600", width: "fit-content" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FFD600" }} />
              Lightning Fast Delivery
            </div>
            <h1 className="anim-2" style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(44px, 5.5vw, 72px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px" }}>
              Shop <span style={{ color: "#FFD600" }}>Smarter.</span>
              <span style={{ display: "block", background: "linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.5) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Live Better.</span>
            </h1>
            <p className="anim-3" style={{ fontSize: "16px", color: "#B8B5CC", lineHeight: 1.7, maxWidth: "440px" }}>
              Premium electronics, fashion, and more — delivered to your doorstep in minutes.
            </p>
            <div className="anim-4 hero-search-wrap">
              <input className="hero-search-input" type="text" placeholder="Search products, brands, categories…" onKeyDown={(e) => e.key === "Enter" && navigate("/products")} />
              <button className="search-btn" onClick={() => navigate("/products")}>SEARCH</button>
            </div>
            <div className="anim-5" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button className="cta-main" onClick={() => navigate("/products")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Shop Now
              </button>
              <button className="cta-secondary" onClick={() => document.getElementById("featured").scrollIntoView({ behavior: "smooth" })}>Explore Deals</button>
            </div>
            <div className="anim-6" style={{ display: "flex", gap: "32px" }}>
              {[["50K+", "Products"], ["2M+", "Customers"], ["4.9★", "Rating"]].map(([num, label], i) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: "2px", ...(i > 0 ? { borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "32px" } : {}) }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800 }}>{num}</span>
                  <span style={{ fontSize: "12px", color: "#B8B5CC" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sale Card */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="sale-card">
              <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.4), transparent 70%)" }} />
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "3px", color: "#B8B5CC", textTransform: "uppercase", marginBottom: "16px" }}>Limited Time</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "80px", fontWeight: 800, lineHeight: 1, color: "#FFD600", letterSpacing: "-4px", textShadow: "0 0 60px rgba(255,214,0,0.3)" }}>50%</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 700, color: "#fff", margin: "4px 0 24px", letterSpacing: "-1px" }}>OFF TODAY</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #16a34a, #15803d)", color: "white", borderRadius: "99px", padding: "10px 24px", fontSize: "13px", fontWeight: 600, fontFamily: "'Syne', sans-serif", boxShadow: "0 4px 16px rgba(22,163,74,0.4)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Free Shipping
              </div>
              <div style={{ marginTop: "20px", fontSize: "11px", color: "#B8B5CC", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <span className="timer-dot" />
                Ends in {pad(timer.h)}:{pad(timer.m)}:{pad(timer.s)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: FEATURED PRODUCTS ── */}
      <section id="featured" style={{ padding: "100px 48px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(59,47,217,0.15) 0%, transparent 70%)", zIndex: 0 }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#FFD600", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Hand Picked</p>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-sub" style={{ margin: 0 }}>Top picks from our collection just for you</p>
            </div>
            <button onClick={() => navigate("/products")} style={{ display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 20px", color: "#fff", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 600, transition: "all 0.2s" }}>
              View All <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#B8B5CC" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
              <p>No products yet — add some from MongoDB Compass!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
              {products.slice(0, 8).map((product) => (
                <div key={product._id} className="product-card">
                  <div onClick={() => navigate(`/products/${product._id}`)} style={{ height: "200px", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ fontSize: "48px" }}>📦</div>
                    )}
                  </div>
                  <div style={{ padding: "16px" }}>
                    <div style={{ fontSize: "11px", color: "#FFD600", marginBottom: "6px", fontWeight: 500 }}>{product.category}</div>
                    <h3 onClick={() => navigate(`/products/${product._id}`)} style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 600, marginBottom: "8px", lineHeight: 1.3 }}>{product.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
                      <span style={{ color: "#FFD600", fontSize: "12px" }}>★</span>
                      <span style={{ fontSize: "12px", color: "#B8B5CC" }}>{product.ratings?.toFixed(1) || "0.0"} ({product.numReviews || 0})</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "#FFD600" }}>₹{product.price?.toLocaleString()}</span>
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
        </div>
      </section>

      {/* ── SECTION 3: CATEGORIES ── */}
      <section id="categories" style={{ padding: "100px 48px", background: "rgba(255,255,255,0.02)", borderTop: "0.5px solid rgba(255,255,255,0.06)", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontSize: "12px", color: "#FFD600", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Browse</p>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-sub">Find exactly what you're looking for</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {categories.map(({ icon, name }) => (
              <div key={name} className="cat-card" onClick={() => { navigate("/products"); }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>{icon}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>{name}</h3>
                <p style={{ fontSize: "12px", color: "#B8B5CC" }}>Shop now →</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: WHY SNAPMART ── */}
      <section id="features" style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontSize: "12px", color: "#FFD600", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Why Us</p>
            <h2 className="section-title">Why Choose SnapMart?</h2>
            <p className="section-sub">We're committed to giving you the best shopping experience</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="feature-card">
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>{icon}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>{title}</h3>
                <p style={{ fontSize: "13px", color: "#B8B5CC", lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", padding: "48px", background: "rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, marginBottom: "8px" }}>
              ⚡<span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span>
            </div>
            <p style={{ fontSize: "13px", color: "#B8B5CC" }}>Premium shopping, lightning fast delivery.</p>
          </div>
          <div style={{ display: "flex", gap: "32px" }}>
            {[["Products", "/products"], ["Orders", "/orders"], ["Profile", "/profile"]].map(([label, path]) => (
              <span key={label} onClick={() => navigate(path)} style={{ fontSize: "13px", color: "#B8B5CC", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.target.style.color = "#fff"}
                onMouseLeave={(e) => e.target.style.color = "#B8B5CC"}
              >{label}</span>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "#B8B5CC" }}>© 2026 SnapMart. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
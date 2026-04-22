import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../redux/slices/orderSlice";
import { clearCart } from "../redux/slices/cartSlice";
import paymentService from "../services/paymentService";
import orderService from "../services/orderService";
import toast from "react-hot-toast";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script   = document.createElement("script");
    script.id      = "razorpay-script";
    script.src     = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Checkout() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { loading }           = useSelector((state) => state.orders);
  const { user }              = useSelector((state) => state.auth);

  const [address, setAddress]             = useState({ street: "", city: "", state: "", pincode: "", country: "India" });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [processing, setProcessing]       = useState(false);

  // coupon state
  const [couponCode, setCouponCode]       = useState("");
  const [coupon, setCoupon]               = useState(null); // { code, discountType, discountValue, discount }
  const [couponLoading, setCouponLoading] = useState(false);

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  // calculate final price
  const discount   = coupon?.discount || 0;
  const finalPrice = Math.max(0, totalPrice - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { toast.error("Enter a coupon code"); return; }
    try {
      setCouponLoading(true);
      const data = await orderService.applyCoupon(couponCode.trim());
      setCoupon({ ...data.data.coupon, discount: data.data.discount });
      toast.success(`Coupon applied! You save ₹${data.data.discount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
      setCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await orderService.removeCoupon();
    } catch {}
    setCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  const handleRazorpay = async (order) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) { toast.error("Razorpay failed to load"); return; }

    const { data } = await paymentService.createRazorpayOrder(order._id);

    return new Promise((resolve, reject) => {
      const options = {
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        name:        "SnapMart",
        description: `Order #${order._id}`,
        order_id:    data.razorpayOrderId,
        prefill:     { name: user?.name, email: user?.email },
        theme:       { color: "#FFD600" },
        handler: async (response) => {
          try {
            await paymentService.verifyPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId:           order._id,
            });
            resolve();
          } catch (err) { reject(err); }
        },
        modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill all address fields"); return;
    }
    if (items.length === 0) { toast.error("Cart is empty"); return; }

    try {
      setProcessing(true);

      const result = await dispatch(createOrder({
        shippingAddress: address,
        paymentMethod,
        couponCode: coupon ? coupon.code : undefined, // 👈 send coupon
      }));

      if (!createOrder.fulfilled.match(result)) {
        toast.error(result.payload || "Failed to place order"); return;
      }

      const order = result.payload.order;

      if (paymentMethod === "razorpay") {
        await handleRazorpay(order);
        toast.success("Payment successful! Order confirmed 🎉");
      } else {
        toast.success("Order placed successfully!");
      }

      dispatch(clearCart());
      navigate("/orders");
    } catch (err) {
      if (err.message === "Payment cancelled") {
        toast.error("Payment cancelled");
      } else {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B1F", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .checkout-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 16px; font-size: 14px; color: #fff; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .checkout-input:focus { border-color: rgba(255,214,0,0.5); }
        .checkout-input::placeholder { color: rgba(255,255,255,0.3); }
        .pay-option { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 14px 16px; cursor: pointer; transition: all 0.2s; margin-bottom: 10px; }
        .pay-option.selected { background: rgba(255,214,0,0.08); border-color: rgba(255,214,0,0.4); }
        .pay-option:hover { border-color: rgba(255,255,255,0.2); }
        .radio { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
        .radio.checked { border-color: #FFD600; }
        .radio-dot { width: 8px; height: 8px; border-radius: 50%; background: #FFD600; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: "64px", background: "rgba(13,11,31,0.95)", backdropFilter: "blur(16px)", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
        <span onClick={() => navigate("/")} style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, cursor: "pointer" }}>
          ⚡<span>Snap</span><span style={{ color: "#FFD600" }}>Mart</span>
        </span>
        <button onClick={() => navigate("/cart")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 16px", color: "#fff", cursor: "pointer" }}>← Back to Cart</button>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "32px", fontWeight: 800, marginBottom: "32px" }}>Checkout</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px" }}>

          {/* LEFT */}
          <form onSubmit={handleOrder}>

            {/* Shipping Address */}
            <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Shipping Address</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { name: "street",  label: "Street Address", placeholder: "123 Main Street" },
                  { name: "city",    label: "City",           placeholder: "Mumbai" },
                  { name: "state",   label: "State",          placeholder: "Maharashtra" },
                  { name: "pincode", label: "Pincode",        placeholder: "400001" },
                  { name: "country", label: "Country",        placeholder: "India" },
                ].map(({ name, label, placeholder }) => (
                  <div key={name}>
                    <label style={{ fontSize: "12px", color: "#B8B5CC", marginBottom: "6px", display: "block" }}>{label}</label>
                    <input className="checkout-input" name={name} placeholder={placeholder} value={address[name]} onChange={handleChange} />
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon Code */}
            <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Coupon Code</h2>

              {coupon ? (
                // coupon applied state
                <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#22c55e", marginBottom: "2px" }}>🎉 {coupon.code} applied!</p>
                    <p style={{ fontSize: "12px", color: "#B8B5CC" }}>You save ₹{discount.toLocaleString()}</p>
                  </div>
                  <button type="button" onClick={handleRemoveCoupon} style={{ background: "rgba(239,68,68,0.15)", border: "none", borderRadius: "6px", padding: "6px 12px", color: "#ef4444", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                </div>
              ) : (
                // coupon input
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    className="checkout-input"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    style={{ background: "#FFD600", color: "#0D0B1F", border: "none", borderRadius: "10px", padding: "12px 20px", fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, cursor: couponLoading ? "not-allowed" : "pointer", opacity: couponLoading ? 0.7 : 1, whiteSpace: "nowrap" }}
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Payment Method</h2>

              <div className={`pay-option${paymentMethod === "cod" ? " selected" : ""}`} onClick={() => setPaymentMethod("cod")}>
                <div className={`radio${paymentMethod === "cod" ? " checked" : ""}`}>
                  {paymentMethod === "cod" && <div className="radio-dot" />}
                </div>
                <span style={{ fontSize: "24px" }}>💵</span>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>Cash on Delivery</p>
                  <p style={{ fontSize: "12px", color: "#B8B5CC" }}>Pay when you receive your order</p>
                </div>
              </div>

              <div className={`pay-option${paymentMethod === "razorpay" ? " selected" : ""}`} onClick={() => setPaymentMethod("razorpay")}>
                <div className={`radio${paymentMethod === "razorpay" ? " checked" : ""}`}>
                  {paymentMethod === "razorpay" && <div className="radio-dot" />}
                </div>
                <span style={{ fontSize: "24px" }}>💳</span>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>Pay Online</p>
                  <p style={{ fontSize: "12px", color: "#B8B5CC" }}>UPI, Cards, Netbanking, Wallets via Razorpay</p>
                </div>
              </div>

              {paymentMethod === "razorpay" && (
                <div style={{ background: "rgba(255,214,0,0.06)", border: "1px solid rgba(255,214,0,0.2)", borderRadius: "10px", padding: "14px 16px", marginTop: "8px" }}>
                  <p style={{ fontSize: "13px", color: "#FFD600", marginBottom: "4px", fontWeight: 500 }}>Secure Payment via Razorpay</p>
                  <p style={{ fontSize: "12px", color: "#B8B5CC" }}>Supports UPI, Google Pay, PhonePe, Cards & Netbanking.</p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || processing}
              style={{ width: "100%", background: "#FFD600", color: "#0D0B1F", border: "none", borderRadius: "10px", padding: "16px", fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, cursor: loading || processing ? "not-allowed" : "pointer", opacity: loading || processing ? 0.7 : 1 }}
            >
              {processing ? "Processing..." : paymentMethod === "razorpay" ? `Proceed to Pay ₹${finalPrice.toLocaleString()}` : "Place Order (COD)"}
            </button>
          </form>

          {/* RIGHT — Order Summary */}
          <div style={{ background: "#1A1730", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", height: "fit-content", position: "sticky", top: "80px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Order Summary</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              {items.map((item) => (
                <div key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "rgba(255,255,255,0.04)", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.product?.images?.[0]?.url
                        ? <img src={item.product.images[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontSize: "16px" }}>📦</span>}
                    </div>
                    <span style={{ color: "#B8B5CC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.product?.title} x{item.quantity}</span>
                  </div>
                  <span style={{ fontWeight: 500, flexShrink: 0 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", paddingTop: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#B8B5CC", marginBottom: "8px" }}>
                <span>Subtotal</span><span>₹{totalPrice?.toLocaleString()}</span>
              </div>

              {/* 👇 show discount row only if coupon applied */}
              {coupon && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                  <span style={{ color: "#22c55e" }}>Discount ({coupon.code})</span>
                  <span style={{ color: "#22c55e" }}>- ₹{discount.toLocaleString()}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#B8B5CC", marginBottom: "8px" }}>
                <span>Shipping</span><span style={{ color: "#22c55e" }}>Free</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#B8B5CC" }}>
                <span>Payment</span>
                <span style={{ color: "#FFD600", textTransform: "uppercase" }}>{paymentMethod === "razorpay" ? "Razorpay" : "COD"}</span>
              </div>
            </div>

            <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px" }}>Total</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "22px", color: "#FFD600" }}>₹{finalPrice.toLocaleString()}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
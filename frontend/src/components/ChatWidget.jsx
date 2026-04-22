import { useState, useRef, useEffect } from "react";

const getReply = (msg) => {
  const m = msg.toLowerCase();

  if (m.match(/track|where.*order|order.*status|shipped|delivery/))
    return "To track your order, go to **My Orders** page and click on your order to see real-time status updates. 📦";

  if (m.match(/cancel/))
    return "To cancel an order, go to **My Orders** → click the order → contact us at support@snapmart.com with your Order ID. We'll process it within 24 hours.";

  if (m.match(/refund|money back|return/))
    return "We offer refunds within 7 days of delivery. Email support@snapmart.com with your Order ID and reason. Refunds are processed in 3-5 business days. 💰";

  if (m.match(/payment.*fail|fail.*payment|payment.*not|couldn't pay/))
    return "Sorry about that! Please try again with a different payment method. If money was deducted, it will be refunded in 3-5 business days. Contact support@snapmart.com with your Order ID. 💳";

  if (m.match(/coupon|discount|promo|offer/))
    return "You can apply coupon codes at checkout! Enter the code in the **Coupon Code** field and click Apply. Discounts are applied instantly. 🎟️";

  if (m.match(/shipping|delivery.*time|how long|when.*deliver/))
    return "We offer **free shipping** on all orders! Delivery takes 3-7 business days depending on your location. 🚚";

  if (m.match(/cod|cash on delivery/))
    return "Yes, we support **Cash on Delivery**! Select COD at checkout and pay when your order arrives. 💵";

  if (m.match(/razorpay|upi|online.*pay|pay.*online/))
    return "We accept online payments via **Razorpay** — supports UPI, Google Pay, PhonePe, Cards, and Netbanking. All payments are 100% secure. 🔒";

  if (m.match(/account|login|password|register|sign/))
    return "For account issues, try resetting your password on the login page. If you're still stuck, email support@snapmart.com and we'll help you out. 🔑";

  if (m.match(/product|item|stock|available/))
    return "You can browse all products on our **Products** page. Use filters to find exactly what you need. If an item is out of stock, check back soon! 🛍️";

  if (m.match(/contact|support|help|human|agent/))
    return "You can reach our support team at 📧 support@snapmart.com. We respond within 24 hours, 7 days a week!";

  if (m.match(/hi|hello|hey|good morning|good evening|namaste/))
    return "Hello! 👋 How can I help you today? You can ask me about orders, payments, shipping, returns, or coupons!";

  if (m.match(/thank|thanks|great|awesome|perfect/))
    return "You're welcome! 😊 Is there anything else I can help you with?";

  if (m.match(/bye|goodbye|ok|okay/))
    return "Goodbye! Have a great shopping experience at SnapMart! 🛒";

  return "I'm not sure about that. Here's what I can help with:\n\n• 📦 Track your order\n• 💳 Payment issues\n• 🚚 Shipping info\n• 🔄 Returns & refunds\n• 🎟️ Coupons & offers\n\nOr email us at support@snapmart.com";
};

const QUICK_REPLIES = ["Track my order", "Payment failed", "Apply coupon", "Return policy", "Shipping info", "Contact support"];

export default function ChatWidget() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! 👋 I'm SnapMart's support assistant. How can I help you today?" }
  ]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMessage = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // simulate typing delay
    setTimeout(() => {
      const reply = getReply(msg);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setLoading(false);
    }, 600);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatMessage = (text) => {
    return text.split("**").map((part, i) =>
      i % 2 === 1
        ? <strong key={i}>{part}</strong>
        : part.split("\n").map((line, j) => <span key={j}>{line}{j < part.split("\n").length - 1 && <br />}</span>)
    );
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div style={{ position: "fixed", bottom: "88px", right: "24px", zIndex: 999, width: "360px", height: "520px", background: "#1A1730", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.5)", fontFamily: "'DM Sans', sans-serif" }}>

          {/* Header */}
          <div style={{ padding: "16px 20px", borderBottom: "0.5px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0D0B1F", borderRadius: "20px 20px 0 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#FFD600", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>⚡</div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff", margin: 0 }}>SnapMart Support</p>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
                  <p style={{ fontSize: "11px", color: "#22c55e", margin: 0 }}>Online 24/7</p>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "20px", padding: 0, lineHeight: 1 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "assistant" && (
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FFD600", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", marginRight: "8px", flexShrink: 0, alignSelf: "flex-end" }}>⚡</div>
                )}
                <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: msg.role === "user" ? "#FFD600" : "rgba(255,255,255,0.06)", color: msg.role === "user" ? "#0D0B1F" : "#fff", fontSize: "13px", lineHeight: 1.6 }}>
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}

            {/* typing indicator */}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FFD600", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>⚡</div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "14px 14px 14px 4px", padding: "12px 16px", display: "flex", gap: "4px", alignItems: "center" }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#B8B5CC", animation: `bounce 1s ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div style={{ padding: "0 16px 12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {QUICK_REPLIES.map((q) => (
                <button key={q} onClick={() => sendMessage(q)} style={{ background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.2)", borderRadius: "99px", padding: "5px 12px", color: "#FFD600", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "0.5px solid rgba(255,255,255,0.08)", display: "flex", gap: "8px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your message..."
              style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "#fff", fontFamily: "'DM Sans', sans-serif", outline: "none" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              style={{ width: "40px", height: "40px", borderRadius: "10px", background: input.trim() ? "#FFD600" : "rgba(255,255,255,0.06)", border: "none", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0, transition: "all 0.2s" }}
            >➤</button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 999, width: "60px", height: "60px", borderRadius: "50%", background: "#FFD600", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", boxShadow: "0 8px 24px rgba(255,214,0,0.4)", transition: "transform 0.2s" }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {open ? "×" : "💬"}
      </button>

      <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }`}</style>
    </>
  );
}
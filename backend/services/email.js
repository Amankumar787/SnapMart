// backend/services/email.js

const nodemailer = require("nodemailer");

// ─── Transporter ────────────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ─── Base template ──────────────────────────────────────────────────────────

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; padding: 0; background: #f4f4f5; font-family: Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background: #111827; padding: 24px 32px; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; letter-spacing: 1px; }
    .body { padding: 32px; color: #374151; font-size: 15px; line-height: 1.7; }
    .footer { background: #f9fafb; padding: 16px 32px; text-align: center; font-size: 12px; color: #9ca3af; }
    .btn { display: inline-block; margin: 20px 0; padding: 12px 28px; background: #111827; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-size: 15px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 13px; font-weight: bold; }
    .badge-success { background: #d1fae5; color: #065f46; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger  { background: #fee2e2; color: #991b1b; }
    table.order-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    table.order-table th { background: #f3f4f6; text-align: left; padding: 10px 12px; font-size: 13px; color: #6b7280; }
    table.order-table td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    .info-row { display: flex; justify-content: space-between; margin: 6px 0; font-size: 14px; }
    .muted { color: #6b7280; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>SnapMart</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} SnapMart. All rights reserved.<br/>
      You received this email because you have an account with us.
    </div>
  </div>
</body>
</html>
`;

// ─── Core send helper ────────────────────────────────────────────────────────

const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: `"SnapMart" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
  return info;
};

// ─── 1. Welcome email ────────────────────────────────────────────────────────

const sendWelcomeEmail = async ({ email, name }) => {
  const html = baseTemplate(`
    <h2>Welcome to SnapMart, ${name}! 👋</h2>
    <p>We're thrilled to have you on board. Start exploring thousands of products curated just for you.</p>
    <a href="${process.env.CLIENT_URL}/products" class="btn">Start Shopping</a>
    <p class="muted">If you didn't create this account, please ignore this email.</p>
  `);

  return sendEmail({ to: email, subject: "Welcome to SnapMart!", html });
};

// ─── 2. Password reset ───────────────────────────────────────────────────────

const sendPasswordResetEmail = async ({ email, name, resetToken }) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  const html = baseTemplate(`
    <h2>Reset your password</h2>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the button below to set a new one. This link expires in <strong>15 minutes</strong>.</p>
    <a href="${resetUrl}" class="btn">Reset Password</a>
    <hr class="divider" />
    <p class="muted">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
  `);

  return sendEmail({ to: email, subject: "Reset your SnapMart password", html });
};

// ─── 3. Order confirmation ───────────────────────────────────────────────────

const sendOrderConfirmation = async ({ email, name, order }) => {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align:center;">${item.quantity}</td>
        <td style="text-align:right;">₹${item.price.toFixed(2)}</td>
        <td style="text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const html = baseTemplate(`
    <h2>Order confirmed!</h2>
    <p>Hi ${name}, thank you for your order. We'll notify you once it ships.</p>

    <div style="background:#f9fafb; border-radius:6px; padding:16px; margin:16px 0;">
      <div class="info-row"><span class="muted">Order ID</span><strong>#${order._id}</strong></div>
      <div class="info-row"><span class="muted">Date</span><span>${new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span></div>
      <div class="info-row"><span class="muted">Payment</span><span class="badge badge-success">${order.paymentMethod}</span></div>
    </div>

    <table class="order-table">
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Price</th>
          <th style="text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div style="text-align:right; font-size:15px;">
      ${order.discount ? `<div class="info-row"><span class="muted">Discount</span><span style="color:#065f46;">- ₹${order.discount.toFixed(2)}</span></div>` : ""}
      <div class="info-row"><span class="muted">Shipping</span><span>${order.shippingCharge === 0 ? "Free" : "₹" + order.shippingCharge}</span></div>
      <div class="info-row"><strong>Total</strong><strong>₹${order.totalAmount.toFixed(2)}</strong></div>
    </div>

    <hr class="divider" />
    <p><strong>Shipping to:</strong><br/>
    ${order.shippingAddress.street}, ${order.shippingAddress.city},<br/>
    ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>

    <a href="${process.env.CLIENT_URL}/orders/${order._id}" class="btn">Track Order</a>
  `);

  return sendEmail({ to: email, subject: `Order confirmed #${order._id} — SnapMart`, html });
};

// ─── 4. Order status update ──────────────────────────────────────────────────

const STATUS_META = {
  processing: { label: "Processing",  badge: "badge-warning", message: "Your order is being processed and will be shipped soon." },
  shipped:    { label: "Shipped",     badge: "badge-warning", message: "Your order is on its way! You can track it using the button below." },
  delivered:  { label: "Delivered",   badge: "badge-success", message: "Your order has been delivered. We hope you love it!" },
  cancelled:  { label: "Cancelled",   badge: "badge-danger",  message: "Your order has been cancelled. If you didn't request this, please contact support." },
};

const sendOrderStatusUpdate = async ({ email, name, order }) => {
  const meta = STATUS_META[order.status] || { label: order.status, badge: "badge-warning", message: "Your order status has been updated." };

  const html = baseTemplate(`
    <h2>Order update</h2>
    <p>Hi ${name}, your order status has changed.</p>

    <div style="background:#f9fafb; border-radius:6px; padding:16px; margin:16px 0;">
      <div class="info-row"><span class="muted">Order ID</span><strong>#${order._id}</strong></div>
      <div class="info-row"><span class="muted">Status</span><span class="badge ${meta.badge}">${meta.label}</span></div>
      ${order.trackingId ? `<div class="info-row"><span class="muted">Tracking ID</span><span>${order.trackingId}</span></div>` : ""}
    </div>

    <p>${meta.message}</p>
    <a href="${process.env.CLIENT_URL}/orders/${order._id}" class="btn">View Order</a>
  `);

  return sendEmail({ to: email, subject: `Your order is ${meta.label} — SnapMart`, html });
};

// ─── 5. Payment success ──────────────────────────────────────────────────────

const sendPaymentSuccess = async ({ email, name, order, paymentId }) => {
  const html = baseTemplate(`
    <h2>Payment received!</h2>
    <p>Hi ${name}, we've received your payment successfully.</p>

    <div style="background:#f9fafb; border-radius:6px; padding:16px; margin:16px 0;">
      <div class="info-row"><span class="muted">Order ID</span><strong>#${order._id}</strong></div>
      <div class="info-row"><span class="muted">Payment ID</span><span>${paymentId}</span></div>
      <div class="info-row"><span class="muted">Amount paid</span><strong>₹${order.totalAmount.toFixed(2)}</strong></div>
      <div class="info-row"><span class="muted">Status</span><span class="badge badge-success">Paid</span></div>
    </div>

    <a href="${process.env.CLIENT_URL}/orders/${order._id}" class="btn">View Order</a>
  `);

  return sendEmail({ to: email, subject: `Payment confirmed for order #${order._id}`, html });
};

// ─── 6. Payment failed ───────────────────────────────────────────────────────

const sendPaymentFailed = async ({ email, name, order }) => {
  const html = baseTemplate(`
    <h2>Payment failed</h2>
    <p>Hi ${name}, unfortunately your payment for order <strong>#${order._id}</strong> could not be processed.</p>
    <p>Your cart items have been saved. Please try again using the button below.</p>
    <a href="${process.env.CLIENT_URL}/checkout" class="btn">Retry Payment</a>
    <hr class="divider" />
    <p class="muted">If you continue to face issues, please contact our support team.</p>
  `);

  return sendEmail({ to: email, subject: `Payment failed for order #${order._id} — SnapMart`, html });
};

// ─── Exports ─────────────────────────────────────────────────────────────────

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendPaymentSuccess,
  sendPaymentFailed,
};
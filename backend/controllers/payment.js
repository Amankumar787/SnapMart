const Razorpay = require("razorpay");
const crypto   = require("crypto");
const Order    = require("../models/Order");
const User     = require("../models/User");
const AppError = require("../utils/AppError");
const { successResponse } = require("../utils/apiResponse");
const { sendPaymentSuccess, sendPaymentFailed } = require("../services/email");

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST /api/payments/create-order
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return next(new AppError("Order not found", 404, "NOT_FOUND"));

    if (order.user.toString() !== req.user._id.toString())
      return next(new AppError("Access denied", 403, "FORBIDDEN"));

    if (order.paymentStatus === "paid")
      return next(new AppError("Order already paid", 400, "ALREADY_PAID"));

    // Razorpay amount is in paise (1 INR = 100 paise)
    const razorpayOrder = await razorpay.orders.create({
      amount:   Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt:  `receipt_${order._id}`,
      notes:    { orderId: order._id.toString(), userId: req.user._id.toString() },
    });

    successResponse(res, 200, "Razorpay order created", {
      razorpayOrderId: razorpayOrder.id,
      amount:          razorpayOrder.amount,
      currency:        razorpayOrder.currency,
      keyId:           process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/payments/verify
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    // verify signature — this confirms payment is genuine
    const body      = razorpayOrderId + "|" + razorpayPaymentId;
    const expected  = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpaySignature)
      return next(new AppError("Payment verification failed", 400, "INVALID_SIGNATURE"));

    const order = await Order.findById(orderId);
    if (!order) return next(new AppError("Order not found", 404, "NOT_FOUND"));

    order.paymentStatus    = "paid";
    order.razorpayOrderId  = razorpayOrderId;
    order.razorpayPaymentId = razorpayPaymentId;
    order.orderStatus      = "confirmed";
    order.statusHistory.push({ status: "confirmed", note: "Payment verified via Razorpay" });
    await order.save();

    // send payment success email
    try {
      await sendPaymentSuccess({
        email:     req.user.email,
        name:      req.user.name,
        order,
        paymentId: razorpayPaymentId,
      });
    } catch (emailErr) {
      console.error("Payment success email failed:", emailErr.message);
    }

    successResponse(res, 200, "Payment verified successfully", { order });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/payments/refund  (Admin)
const refundPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return next(new AppError("Order not found", 404, "NOT_FOUND"));
    if (!order.razorpayPaymentId)
      return next(new AppError("No payment found for this order", 400, "NO_PAYMENT"));
    if (order.paymentStatus === "refunded")
      return next(new AppError("Already refunded", 400, "ALREADY_REFUNDED"));

    await razorpay.payments.refund(order.razorpayPaymentId, {
      amount: Math.round(order.totalAmount * 100),
    });

    order.paymentStatus = "refunded";
    order.orderStatus   = "cancelled";
    order.statusHistory.push({ status: "cancelled", note: "Refund processed" });
    await order.save();

    successResponse(res, 200, "Refund processed successfully", { order });
  } catch (err) {
    next(err);
  }
};

module.exports = { createRazorpayOrder, verifyPayment, refundPayment };
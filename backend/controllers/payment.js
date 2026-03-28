const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Order  = require("../models/Order");
const AppError = require("../utils/AppError");
const { successResponse } = require("../utils/apiResponse");

// @route   POST /api/payments/create-intent
const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return next(new AppError("Order not found", 404, "NOT_FOUND"));

    if (order.user.toString() !== req.user._id.toString())
      return next(new AppError("Access denied", 403, "FORBIDDEN"));

    if (order.paymentStatus === "paid")
      return next(new AppError("Order already paid", 400, "ALREADY_PAID"));

    // Amount in paise (INR) or cents (USD) — Stripe requires smallest unit
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(order.totalAmount * 100),
      currency: "inr",
      metadata: {
        orderId:  order._id.toString(),
        userId:   req.user._id.toString(),
      },
    });

    successResponse(res, 200, "Payment intent created", {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/payments/verify
const verifyPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded")
      return next(new AppError("Payment not completed", 400, "PAYMENT_FAILED"));

    const order = await Order.findById(orderId);
    if (!order) return next(new AppError("Order not found", 404, "NOT_FOUND"));

    order.paymentStatus  = "paid";
    order.stripePaymentId = paymentIntentId;
    order.orderStatus    = "confirmed";
    order.statusHistory.push({ status: "confirmed", note: "Payment verified" });
    await order.save();

    successResponse(res, 200, "Payment verified successfully", { order });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/payments/webhook
// Raw body required — add express.raw() middleware before this route
const stripeWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ success: false, message: `Webhook error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const intent = event.data.object;
        const order  = await Order.findById(intent.metadata.orderId);
        if (order && order.paymentStatus !== "paid") {
          order.paymentStatus   = "paid";
          order.stripePaymentId = intent.id;
          order.orderStatus     = "confirmed";
          order.statusHistory.push({ status: "confirmed", note: "Payment succeeded via webhook" });
          await order.save();
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const intent = event.data.object;
        const order  = await Order.findById(intent.metadata.orderId);
        if (order) {
          order.paymentStatus = "failed";
          order.statusHistory.push({ status: order.orderStatus, note: "Payment failed" });
          await order.save();
        }
        break;
      }
      default:
        break;
    }

    res.json({ received: true });
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
    if (!order.stripePaymentId)
      return next(new AppError("No payment found for this order", 400, "NO_PAYMENT"));
    if (order.paymentStatus === "refunded")
      return next(new AppError("Already refunded", 400, "ALREADY_REFUNDED"));

    await stripe.refunds.create({ payment_intent: order.stripePaymentId });

    order.paymentStatus = "refunded";
    order.orderStatus   = "cancelled";
    order.statusHistory.push({ status: "cancelled", note: "Refund processed" });
    await order.save();

    successResponse(res, 200, "Refund processed successfully", { order });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPaymentIntent, verifyPayment, stripeWebhook, refundPayment };
const express = require("express");
const router  = express.Router();
const {
  createPaymentIntent, verifyPayment,
  stripeWebhook, refundPayment,
} = require("../controllers/payment");
const { protect, restrictTo } = require("../middlewares/auth");

// Webhook needs raw body — must come BEFORE express.json()
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

router.use(protect);

router.post("/create-intent", createPaymentIntent);
router.post("/verify",        verifyPayment);

// Admin only
router.post("/refund", restrictTo("admin", "superadmin"), refundPayment);

module.exports = router;
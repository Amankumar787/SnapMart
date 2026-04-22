const express = require("express");
const router  = express.Router();
const { createRazorpayOrder, verifyPayment, refundPayment } = require("../controllers/payment");
const { protect, restrictTo } = require("../middlewares/auth");

router.use(protect);

router.post("/create-order", createRazorpayOrder);
router.post("/verify",       verifyPayment);

// Admin only
router.post("/refund", restrictTo("admin", "superadmin"), refundPayment);

module.exports = router;
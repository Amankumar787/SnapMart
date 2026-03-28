const express = require("express");
const router  = express.Router();
const {
  applyCoupon, removeCoupon,
  createCoupon, getAllCoupons,
  updateCoupon, deleteCoupon,
} = require("../controllers/coupon");
const { protect, restrictTo } = require("../middlewares/auth");

router.use(protect);

// Customer
router.post("/apply",  applyCoupon);
router.delete("/remove", removeCoupon);

// Admin only
router.get("/",        restrictTo("admin", "superadmin"), getAllCoupons);
router.post("/",       restrictTo("admin", "superadmin"), createCoupon);
router.put("/:id",     restrictTo("admin", "superadmin"), updateCoupon);
router.delete("/:id",  restrictTo("admin", "superadmin"), deleteCoupon);

module.exports = router;
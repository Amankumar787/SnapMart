const express = require("express");
const router  = express.Router();
const {
  createOrder, getMyOrders,
  getOrder, updateOrderStatus, getAllOrders,
} = require("../controllers/order");
const { protect, restrictTo } = require("../middlewares/auth");

router.use(protect);

router.post("/",                    createOrder);
router.get("/my",                   getMyOrders);
router.get("/:id",                  getOrder);

// Admin only
router.get("/",                     restrictTo("admin", "superadmin"), getAllOrders);
router.put("/:id/status",           restrictTo("admin", "superadmin"), updateOrderStatus);

module.exports = router;
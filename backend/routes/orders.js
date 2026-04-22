const express = require("express");
const router  = express.Router();
const {
  createOrder, getMyOrders,
  getOrder, updateOrderStatus, getAllOrders,
} = require("../controllers/order");
const { protect, restrictTo } = require("../middlewares/auth");

router.use(protect);

router.post("/",     createOrder);   // create order
router.get("/my",    getMyOrders);   // my orders
router.get("/",      restrictTo("admin", "superadmin"), getAllOrders); // admin
router.get("/:id",   getOrder);      // single order
router.put("/:id/status", restrictTo("admin", "superadmin"), updateOrderStatus); // admin

module.exports = router;
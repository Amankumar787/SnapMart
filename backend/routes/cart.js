const express = require("express");
const router  = express.Router();
const {
  getCart, addToCart,
  updateCartItem, removeFromCart, clearCart,
} = require("../controllers/cart");
const { protect } = require("../middlewares/auth");

// All cart routes are private
router.use(protect);

router.get("/",           getCart);
router.post("/",          addToCart);
router.put("/:itemId",    updateCartItem);
router.delete("/",        clearCart);
router.delete("/:itemId", removeFromCart);

module.exports = router;
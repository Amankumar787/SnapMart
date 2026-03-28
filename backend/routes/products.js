const express    = require("express");
const router     = express.Router();
const {
  getProducts, getProduct,
  createProduct, updateProduct,
  deleteProduct, addReview,
} = require("../controllers/product");
const { protect, restrictTo } = require("../middlewares/auth");

// Public
router.get("/",    getProducts);
router.get("/:id", getProduct);

// Admin only
router.post("/",       protect, restrictTo("admin", "superadmin"), createProduct);
router.put("/:id",     protect, restrictTo("admin", "superadmin"), updateProduct);
router.delete("/:id",  protect, restrictTo("admin", "superadmin"), deleteProduct);

// Customer
router.post("/:id/reviews", protect, addReview);

module.exports = router;
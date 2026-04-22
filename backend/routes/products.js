const express    = require("express");
const router     = express.Router();
const {
  getProducts, getProduct,
  createProduct, updateProduct,
  deleteProduct, addReview,
} = require("../controllers/product");
const { protect, restrictTo } = require("../middlewares/auth");
const { upload } = require("../services/upload"); // 👈 add this

// Public
router.get("/",    getProducts);
router.get("/:id", getProduct);

// Admin only — upload.array("images", 5) handles up to 5 images
router.post("/",      protect, restrictTo("admin", "superadmin"), upload.array("images", 5), createProduct);
router.put("/:id",    protect, restrictTo("admin", "superadmin"), upload.array("images", 5), updateProduct);
router.delete("/:id", protect, restrictTo("admin", "superadmin"), deleteProduct);

// Customer
router.post("/:id/reviews", protect, addReview);

module.exports = router;
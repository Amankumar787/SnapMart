const express = require("express");
const router  = express.Router();
const { register, login, refresh, logout, getMe } = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

// Public routes
router.post("/register", register);
router.post("/login",    login);
router.post("/refresh",  refresh);

// Private routes
router.post("/logout", protect, logout);
router.get("/me",      protect, getMe);

module.exports = router;
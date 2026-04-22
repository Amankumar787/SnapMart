// backend/routes/auth.js

const express = require("express");
const router  = express.Router();
const { register, login, refresh, logout, getMe } = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login",    login);
router.post("/refresh",  refresh);
router.post("/logout", protect, logout);
router.get("/me",      protect, getMe);

module.exports = router;
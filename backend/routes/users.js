const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const { protect, restrictTo } = require("../middlewares/auth");
const { successResponse } = require("../utils/apiResponse");

router.get("/", protect, restrictTo("admin", "superadmin"), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    successResponse(res, 200, "Users fetched", { users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
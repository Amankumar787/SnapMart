const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const protect = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null;

    if (!token) return next(new AppError("Not authenticated", 401, "NO_TOKEN"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive)
      return next(new AppError("User not found or inactive", 401, "USER_NOT_FOUND"));

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return next(new AppError("Access denied", 403, "FORBIDDEN"));
  next();
};

module.exports = { protect, restrictTo };
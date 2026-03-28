const Coupon = require("../models/Coupon");
const Cart   = require("../models/Cart");
const AppError = require("../utils/AppError");
const { successResponse } = require("../utils/apiResponse");

// @route   POST /api/coupons/apply
const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return next(new AppError("Coupon code required", 400, "MISSING_CODE"));

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon || !coupon.isValid())
      return next(new AppError("Invalid or expired coupon", 400, "INVALID_COUPON"));

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0)
      return next(new AppError("Cart is empty", 400, "EMPTY_CART"));

    if (cart.totalPrice < coupon.minOrderAmount)
      return next(
        new AppError(
          `Minimum order amount is ₹${coupon.minOrderAmount}`,
          400,
          "MIN_ORDER_NOT_MET"
        )
      );

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cart.totalPrice * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.value;
    }

    const finalAmount = Math.max(cart.totalPrice - discount, 0);

    // Attach coupon to cart
    cart.coupon = coupon._id;
    await cart.save();

    successResponse(res, 200, "Coupon applied", {
      discount,
      finalAmount,
      coupon: { code: coupon.code, discountType: coupon.discountType, value: coupon.value },
    });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/coupons/remove
const removeCoupon = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new AppError("Cart not found", 404, "NOT_FOUND"));

    cart.coupon = null;
    await cart.save();

    successResponse(res, 200, "Coupon removed", { totalPrice: cart.totalPrice });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/coupons  (Admin)
const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    successResponse(res, 201, "Coupon created", { coupon });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/coupons  (Admin)
const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    successResponse(res, 200, "Coupons fetched", { coupons });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/coupons/:id  (Admin)
const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) return next(new AppError("Coupon not found", 404, "NOT_FOUND"));
    successResponse(res, 200, "Coupon updated", { coupon });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/coupons/:id  (Admin)
const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return next(new AppError("Coupon not found", 404, "NOT_FOUND"));
    successResponse(res, 200, "Coupon deleted");
  } catch (err) {
    next(err);
  }
};

module.exports = { applyCoupon, removeCoupon, createCoupon, getAllCoupons, updateCoupon, deleteCoupon };
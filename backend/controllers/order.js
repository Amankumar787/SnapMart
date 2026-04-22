const Order   = require("../models/Order");
const Cart    = require("../models/Cart");
const Coupon  = require("../models/Coupon");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const { successResponse } = require("../utils/apiResponse");
const { sendOrderConfirmation } = require("../services/email"); // 👈 add this

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = "cod" } = req.body;

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product")
      .populate("coupon");
    if (!cart || cart.items.length === 0)
      return next(new AppError("Cart is empty", 400, "EMPTY_CART"));

    for (const item of cart.items) {
      if (!item.product.isActive)
        return next(new AppError(`${item.product.title} is no longer available`, 400, "PRODUCT_UNAVAILABLE"));
      if (item.product.stock < item.quantity)
        return next(new AppError(`Insufficient stock for ${item.product.title}`, 400, "OUT_OF_STOCK"));
    }

    const orderItems = cart.items.map((item) => ({
      product:  item.product._id,
      title:    item.product.title,
      price:    item.price,
      quantity: item.quantity,
      image:    item.product.images?.[0]?.url || "",
    }));

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let discount = 0;
    if (cart.coupon) {
      const coupon = cart.coupon;
      if (coupon.discountType === "percentage") {
        discount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
      } else {
        discount = coupon.value;
      }
      discount = Math.min(discount, subtotal);
      await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
    }

    const totalAmount = Math.max(subtotal - discount, 0);

    const order = await Order.create({
      user:          req.user._id,
      items:         orderItems,
      shippingAddress,
      totalAmount,
      discount,
      paymentMethod,
      statusHistory: [{ status: "placed", note: "Order placed successfully" }],
    });

    // 👇 send order confirmation email
  try {
  console.log("📧 Sending order confirmation to:", req.user.email);
  await sendOrderConfirmation({
    email: req.user.email,
    name:  req.user.name,
    order: { ...order.toObject(), shippingCharge: 0 },
  });
  console.log("📧 Email sent successfully!");
} catch (emailErr) {
  console.error("📧 Order confirmation email failed:", emailErr.message);
}

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    cart.items  = [];
    cart.coupon = null;
    await cart.save();

    successResponse(res, 201, "Order placed successfully", { order });
  } catch (err) {
    next(err);
  }
};

// ... rest of functions unchanged

// rest of the functions unchanged...
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    successResponse(res, 200, "Orders fetched", { orders });
  } catch (err) { next(err); }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError("Order not found", 404, "NOT_FOUND"));
    if (
      order.user.toString() !== req.user._id.toString() &&
      !["admin", "superadmin"].includes(req.user.role)
    ) return next(new AppError("Access denied", 403, "FORBIDDEN"));
    successResponse(res, 200, "Order fetched", { order });
  } catch (err) { next(err); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ["confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status))
      return next(new AppError("Invalid status", 400, "INVALID_STATUS"));
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError("Order not found", 404, "NOT_FOUND"));
    order.orderStatus = status;
    order.statusHistory.push({ status, note: note || "" });
    if (status === "delivered") {
      order.deliveredAt   = Date.now();
      order.paymentStatus = "paid";
    }
    await order.save();
    successResponse(res, 200, "Order status updated", { order });
  } catch (err) { next(err); }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { orderStatus: status } : {};
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    successResponse(res, 200, "All orders fetched", {
      orders,
      pagination: { total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) { next(err); }
};

module.exports = { createOrder, getMyOrders, getOrder, updateOrderStatus, getAllOrders };
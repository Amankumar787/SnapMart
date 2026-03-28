const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const { successResponse } = require("../utils/apiResponse");

// @route   POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = "stripe" } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0)
      return next(new AppError("Cart is empty", 400, "EMPTY_CART"));

    // Check stock for all items
    for (const item of cart.items) {
      if (!item.product.isActive)
        return next(new AppError(`${item.product.title} is no longer available`, 400, "PRODUCT_UNAVAILABLE"));
      if (item.product.stock < item.quantity)
        return next(new AppError(`Insufficient stock for ${item.product.title}`, 400, "OUT_OF_STOCK"));
    }

    // Build order items snapshot
    const orderItems = cart.items.map((item) => ({
      product:  item.product._id,
      title:    item.product.title,
      price:    item.price,
      quantity: item.quantity,
      image:    item.product.images?.[0]?.url || "",
    }));

    const order = await Order.create({
      user:            req.user._id,
      items:           orderItems,
      shippingAddress,
      totalAmount:     cart.totalPrice,
      paymentMethod,
      statusHistory:   [{ status: "placed", note: "Order placed successfully" }],
    });

    // Deduct stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    successResponse(res, 201, "Order placed successfully", { order });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/orders/my
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    successResponse(res, 200, "Orders fetched", { orders });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/orders/:id
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError("Order not found", 404, "NOT_FOUND"));

    // Only owner or admin can view
    if (
      order.user.toString() !== req.user._id.toString() &&
      !["admin", "superadmin"].includes(req.user.role)
    ) return next(new AppError("Access denied", 403, "FORBIDDEN"));

    successResponse(res, 200, "Order fetched", { order });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/orders/:id/status  (Admin)
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
      order.deliveredAt    = Date.now();
      order.paymentStatus  = "paid";
    }
    await order.save();

    successResponse(res, 200, "Order status updated", { order });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/orders  (Admin)
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
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getMyOrders, getOrder, updateOrderStatus, getAllOrders };
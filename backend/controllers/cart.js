const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const { successResponse } = require("../utils/apiResponse");

// @route   GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "title images price stock isActive"
    );
    if (!cart) return successResponse(res, 200, "Cart is empty", { cart: { items: [], totalPrice: 0 } });
    successResponse(res, 200, "Cart fetched", { cart });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive)
      return next(new AppError("Product not found", 404, "NOT_FOUND"));
    if (product.stock < quantity)
      return next(new AppError("Insufficient stock", 400, "OUT_OF_STOCK"));

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity, price: product.price }],
      });
    } else {
      const existingItem = cart.items.find(
        (i) => i.product.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price: product.price });
      }
      await cart.save();
    }

    await cart.populate("items.product", "title images price stock");
    successResponse(res, 200, "Item added to cart", { cart });
  }  catch (err) {
  console.error("ADD TO CART ERROR:", err);
  res.status(500).json({ success: false, message: err.message });
}
};

// @route   PUT /api/cart/:itemId
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1)
      return next(new AppError("Quantity must be at least 1", 400, "INVALID_QUANTITY"));

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new AppError("Cart not found", 404, "NOT_FOUND"));

    const item = cart.items.id(req.params.itemId);
    if (!item) return next(new AppError("Item not found in cart", 404, "NOT_FOUND"));

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product", "title images price stock");

    successResponse(res, 200, "Cart updated", { cart });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/cart/:itemId
const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new AppError("Cart not found", 404, "NOT_FOUND"));

    cart.items = cart.items.filter(
      (i) => i._id.toString() !== req.params.itemId
    );
    await cart.save();

    successResponse(res, 200, "Item removed from cart", { cart });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new AppError("Cart not found", 404, "NOT_FOUND"));

    cart.items = [];
    await cart.save();

    successResponse(res, 200, "Cart cleared");
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
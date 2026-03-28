const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  title:    String,
  price:    Number,
  quantity: { type: Number, required: true, min: 1 },
  image:    String,
});

const shippingAddressSchema = new mongoose.Schema({
  street:  String,
  city:    String,
  state:   String,
  pincode: String,
  country: String,
});

const orderSchema = new mongoose.Schema(
  {
    user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items:           [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    totalAmount:     { type: Number, required: true },
    discount:        { type: Number, default: 0 },
    paymentStatus:   { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    paymentMethod:   { type: String, enum: ["stripe", "cod"], default: "stripe" },
    stripePaymentId: { type: String },
    orderStatus:     { type: String, enum: ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"], default: "placed" },
    statusHistory:   [{ status: String, timestamp: { type: Date, default: Date.now }, note: String }],
    deliveredAt:     Date,
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

module.exports = mongoose.model("Order", orderSchema);
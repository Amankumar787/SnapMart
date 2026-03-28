const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code:           { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType:   { type: String, enum: ["percentage", "flat"], required: true },
    value:          { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount:    { type: Number },
    expiryDate:     { type: Date, required: true },
    usageLimit:     { type: Number, default: 1 },
    usedCount:      { type: Number, default: 0 },
    isActive:       { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.methods.isValid = function () {
  return this.isActive && new Date() < this.expiryDate && this.usedCount < this.usageLimit;
};

module.exports = mongoose.model("Coupon", couponSchema);
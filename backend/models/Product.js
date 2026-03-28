const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true, trim: true },
    description:   { type: String, required: true },
    price:         { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    category:      { type: String, required: true, index: true },
    brand:         { type: String, trim: true },
    stock:         { type: Number, required: true, default: 0, min: 0 },
    images:        [{ url: String, publicId: String }],
    ratings:       { type: Number, default: 0 },
    numReviews:    { type: Number, default: 0 },
    reviews:       [reviewSchema],
    isFeatured:    { type: Boolean, default: false },
    isActive:      { type: Boolean, default: true },
    tags:          [String],
  },
  { timestamps: true }
);

productSchema.methods.updateRatings = function () {
  if (this.reviews.length === 0) {
    this.ratings = 0;
    this.numReviews = 0;
  } else {
    this.numReviews = this.reviews.length;
    this.ratings = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
  }
};

productSchema.index({ title: "text", description: "text", tags: "text" });
productSchema.index({ price: 1, ratings: -1 });

module.exports = mongoose.model("Product", productSchema);
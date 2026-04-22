const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const { successResponse } = require("../utils/apiResponse");
const { uploadImage, deleteImage } = require("../services/upload"); // 👈 add this

// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, brand, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };
    if (keyword) query.$text = { $search: keyword };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOptions = {
      newest:     { createdAt: -1 },
      oldest:     { createdAt:  1 },
      price_asc:  { price:  1 },
      price_desc: { price: -1 },
      top_rated:  { ratings: -1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };
    const skip   = (Number(page) - 1) * Number(limit);
    const total  = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortBy).skip(skip).limit(Number(limit));

    successResponse(res, 200, "Products fetched", {
      products,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) { next(err); }
};

// @route   GET /api/products/:id
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews.user", "name");
    if (!product || !product.isActive)
      return next(new AppError("Product not found", 404, "NOT_FOUND"));
    successResponse(res, 200, "Product fetched", { product });
  } catch (err) { next(err); }
};

// @route   POST /api/products  (Admin)
const createProduct = async (req, res, next) => {
  try {
    let images = [];

    // 👇 upload each file to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadImage(file.buffer, "snapmart/products")
      );
      images = await Promise.all(uploadPromises);
    }

    const product = await Product.create({ ...req.body, images });
    successResponse(res, 201, "Product created", { product });
  } catch (err) { next(err); }
};

// @route   PUT /api/products/:id  (Admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError("Product not found", 404, "NOT_FOUND"));

    // 👇 if new images uploaded, delete old ones from Cloudinary and upload new
    if (req.files && req.files.length > 0) {
      // delete old images from Cloudinary
      if (product.images && product.images.length > 0) {
        await Promise.all(product.images.map((img) => deleteImage(img.publicId)));
      }

      // upload new images
      const uploadPromises = req.files.map((file) =>
        uploadImage(file.buffer, "snapmart/products")
      );
      req.body.images = await Promise.all(uploadPromises);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    successResponse(res, 200, "Product updated", { product: updated });
  } catch (err) { next(err); }
};

// @route   DELETE /api/products/:id  (Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError("Product not found", 404, "NOT_FOUND"));

    // 👇 delete images from Cloudinary when product is deleted
    if (product.images && product.images.length > 0) {
      await Promise.all(product.images.map((img) => deleteImage(img.publicId)));
    }

    await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    successResponse(res, 200, "Product deleted");
  } catch (err) { next(err); }
};

// @route   POST /api/products/:id/reviews
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError("Product not found", 404, "NOT_FOUND"));

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed)
      return next(new AppError("Product already reviewed", 400, "ALREADY_REVIEWED"));

    product.reviews.push({ user: req.user._id, rating: Number(rating), comment });
    product.updateRatings();
    await product.save();

    successResponse(res, 201, "Review added", { product });
  } catch (err) { next(err); }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview };
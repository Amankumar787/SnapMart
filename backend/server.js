require("dotenv").config();
const express   = require("express");
const helmet    = require("helmet");
const morgan    = require("morgan");
const cors      = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
connectDB();

// Security headers
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
});
app.use("/api", limiter);

// Webhook needs raw body BEFORE express.json()
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

// Routes
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/cart",     require("./routes/cart"));
app.use("/api/orders",   require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/coupons",  require("./routes/coupons"));

app.use("/api/users", require("./routes/users"));

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
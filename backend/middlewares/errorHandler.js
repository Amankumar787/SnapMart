const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message || "Internal Server Error";
  let errorCode  = err.errorCode || "SERVER_ERROR";

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message    = `${field} already exists`;
    errorCode  = "DUPLICATE_FIELD";
    statusCode = 400;
  }

  if (err.name === "ValidationError") {
    message    = Object.values(err.errors).map((e) => e.message).join(", ");
    errorCode  = "VALIDATION_ERROR";
    statusCode = 400;
  }

  if (err.name === "JsonWebTokenError") {
    message    = "Invalid token";
    errorCode  = "INVALID_TOKEN";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message    = "Token expired";
    errorCode  = "TOKEN_EXPIRED";
    statusCode = 401;
  }

  res.status(statusCode).json({ success: false, message, errorCode });
};

module.exports = errorHandler;
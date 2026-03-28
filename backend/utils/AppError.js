class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode  = errorCode || "APP_ERROR";
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
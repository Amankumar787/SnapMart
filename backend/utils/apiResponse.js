const successResponse = (res, statusCode = 200, message = "Success", data = {}) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const errorResponse = (res, statusCode = 500, message = "Error", errorCode = "SERVER_ERROR") => {
  return res.status(statusCode).json({ success: false, message, errorCode });
};

module.exports = { successResponse, errorResponse };
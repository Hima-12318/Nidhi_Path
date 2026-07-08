function sendSuccess(response, payload = {}, statusCode = 200) {
  response.status(statusCode).json({
    success: true,
    ...payload
  });
}

function sendError(response, message, statusCode = 400, extra = {}) {
  response.status(statusCode).json({
    success: false,
    message,
    ...extra
  });
}

module.exports = {
  sendSuccess,
  sendError
};

const { sendSuccess } = require("../utils/responseUtils");

function health(request, response) {
  sendSuccess(response, {
    status: "ok",
    timestamp: new Date().toISOString(),
    mode: "supabase"
  });
}

module.exports = {
  health
};

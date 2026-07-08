const express = require("express");
const enquiryController = require("../controllers/enquiryController");
const { enquiryLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post("/enquiries", enquiryLimiter, enquiryController.createEnquiry);

module.exports = router;

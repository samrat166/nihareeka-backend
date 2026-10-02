const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { submissionLimiter } = require("../middlewares/rateLimitMiddleware");
const {
  postContact,
  getContact,
  getSingleContact,
  deleteContact,
} = require("../controllers/contactController");

// Public: website visitors send a message
router.post("/", submissionLimiter, postContact);

router.get("/", protect(), getContact);

router
  .route("/:id")
  .get(protect(), getSingleContact)
  .delete(protect(), deleteContact);

module.exports = router;

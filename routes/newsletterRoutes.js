const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { submissionLimiter } = require("../middlewares/rateLimitMiddleware");
const {
  postNewsletter,
  getNewsletter,
  deleteNewsletter,
} = require("../controllers/newsletterController");

// Public: website visitors subscribe
router.post("/", submissionLimiter, postNewsletter);

router.get("/", protect(), getNewsletter);

router.delete("/:id", protect(), deleteNewsletter);

module.exports = router;

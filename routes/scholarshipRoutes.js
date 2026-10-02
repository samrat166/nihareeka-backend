const express = require("express");
const router = express.Router();
const { protect, optionalAuth } = require("../middlewares/authMiddleware");
const {
  postScholarship,
  getScholarships,
  getSingleScholarship,
  updateScholarship,
  deleteScholarship,
} = require("../controllers/scholarshipController");

// GET is public, but logged in users get all fields (see scholarshipController)
router
  .route("/")
  .get(optionalAuth(), getScholarships)
  .post(protect(), postScholarship);

router
  .route("/:id")
  .get(optionalAuth(), getSingleScholarship)
  .patch(protect(), updateScholarship)
  .delete(protect(), deleteScholarship);

module.exports = router;

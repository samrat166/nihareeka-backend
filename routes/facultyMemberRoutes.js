const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  postFaculty,
  getFaculty,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/facultyMemberController");

router.route("/").get(getFaculty).post(protect(), postFaculty);

router
  .route("/:id")
  .patch(protect(), updateFaculty)
  .delete(protect(), deleteFaculty);

module.exports = router;

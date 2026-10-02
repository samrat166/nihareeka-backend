const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  postForm,
  getForms,
  getSingleForm,
  updateFormStatus,
  deleteForm,
} = require("../controllers/admissionForm");

// Every admission form route requires login
router.use(protect());

router.route("/").get(getForms).post(postForm);

router.patch("/:id/status", updateFormStatus);

router.route("/:id").get(getSingleForm).delete(deleteForm);

module.exports = router;

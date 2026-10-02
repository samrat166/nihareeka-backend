const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { submissionLimiter } = require("../middlewares/rateLimitMiddleware");
const {
  postForm,
  getForms,
  getSingleForm,
  updateFormStatus,
  deleteForm,
} = require("../controllers/admissionFormController");

// Public: students submit the form, then open the print page for it
router.post("/", submissionLimiter, postForm);

router.get("/", protect(), getForms);

// PUT /form/update/:id/accepted | rejected | pending
router.put("/update/:id/:state", protect(), updateFormStatus);

router.delete("/delete/:id", protect(), deleteForm);

// Public: used by the print page after submitting
router.get("/:id", getSingleForm);

module.exports = router;

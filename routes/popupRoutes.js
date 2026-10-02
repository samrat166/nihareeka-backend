const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  postPopup,
  getPopup,
  updatePopup,
  deletePopup,
} = require("../controllers/popupController");

router.route("/").get(getPopup).post(protect(), postPopup);

router
  .route("/:id")
  .patch(protect(), updatePopup)
  .delete(protect(), deletePopup);

module.exports = router;

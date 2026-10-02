const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  postNotice,
  getNotice,
  getSingleNotice,
  updateNotice,
  deleteNotice,
} = require("../controllers/notice");

router.route("/").get(getNotice).post(protect(), postNotice);

router
  .route("/:id")
  .get(getSingleNotice)
  .patch(protect(), updateNotice)
  .delete(protect(), deleteNotice);

module.exports = router;

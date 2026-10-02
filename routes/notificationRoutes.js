const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getNotification,
  updateNotification,
} = require("../controllers/notification");

router.route("/").get(getNotification).put(protect(), updateNotification);

module.exports = router;

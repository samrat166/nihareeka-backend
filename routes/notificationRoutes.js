const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getNotification,
  updateNotification,
} = require("../controllers/notificationController");

router.get("/", getNotification);

router.put("/:request", protect(), updateNotification);

module.exports = router;

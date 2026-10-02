const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  postEvents,
  getEvents,
  getSingleEvent,
  updateEvents,
  deleteEvents,
} = require("../controllers/events");

router.route("/").get(getEvents).post(protect(), postEvents);

router
  .route("/:id")
  .get(getSingleEvent)
  .patch(protect(), updateEvents)
  .delete(protect(), deleteEvents);

module.exports = router;

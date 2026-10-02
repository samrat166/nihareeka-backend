const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  postContact,
  getContact,
  getSingleContact,
  deleteContact,
} = require("../controllers/contact");

// Every contact route requires login
router.use(protect());

router.route("/").get(getContact).post(postContact);

router.route("/:id").get(getSingleContact).delete(deleteContact);

module.exports = router;

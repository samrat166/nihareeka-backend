const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  postNewsletter,
  getNewsletter,
  deleteNewsletter,
} = require("../controllers/newsletter");

// Every newsletter route requires login
router.use(protect());

router.route("/").get(getNewsletter).post(postNewsletter);

router.delete("/:id", deleteNewsletter);

module.exports = router;

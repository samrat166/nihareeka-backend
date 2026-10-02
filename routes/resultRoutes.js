const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  postResult,
  getResult,
  updateResult,
  deleteResult,
} = require("../controllers/result");

router.route("/").get(getResult).post(protect(), postResult);

router
  .route("/:id")
  .patch(protect(), updateResult)
  .delete(protect(), deleteResult);

module.exports = router;

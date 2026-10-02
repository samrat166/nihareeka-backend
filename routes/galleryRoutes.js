const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  postGallery,
  getGallery,
  getByFaculty,
  updateGallery,
  deleteGallery,
} = require("../controllers/gallery");

router.route("/").get(getGallery).post(protect(), postGallery);

router.get("/faculty/:faculty", getByFaculty);

router
  .route("/:id")
  .patch(protect(), updateGallery)
  .delete(protect(), deleteGallery);

module.exports = router;

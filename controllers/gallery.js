const asyncHandler = require("express-async-handler");
const Gallery = require("../models/gallery");
const { cleanBody, ensureValidId, orNotFound } = require("../utils/helpers");

module.exports.postGallery = asyncHandler(async (req, res) => {
  const insertGallery = await Gallery.create(cleanBody(req.body));
  res.status(201).json(insertGallery);
});

module.exports.getGallery = asyncHandler(async (req, res) => {
  const getGallery = await Gallery.find().sort({ createdAt: -1 });
  res.json(getGallery);
});

module.exports.getByFaculty = asyncHandler(async (req, res) => {
  const { faculty } = req.params;
  const response = await Gallery.find({ faculty }).sort({ createdAt: -1 });
  res.json(response);
});

module.exports.updateGallery = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const updatedGallery = await Gallery.findByIdAndUpdate(
    req.params.id,
    cleanBody(req.body),
    { new: true, runValidators: true }
  );
  res.json(orNotFound(updatedGallery, "Gallery item"));
});

module.exports.deleteGallery = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const response = await Gallery.findByIdAndDelete(req.params.id);
  res.json(orNotFound(response, "Gallery item"));
});

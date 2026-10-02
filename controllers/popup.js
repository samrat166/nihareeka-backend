const asyncHandler = require("express-async-handler");
const Popup = require("../models/popup");
const { cleanBody, ensureValidId, orNotFound } = require("../utils/helpers");

module.exports.postPopup = asyncHandler(async (req, res) => {
  const insertPopup = await Popup.create(cleanBody(req.body));
  res.status(201).json(insertPopup);
});

// Optional filter: GET /api/popup?type=carousel
module.exports.getPopup = asyncHandler(async (req, res) => {
  const filter = {};
  if (typeof req.query.type === "string") {
    filter.type = req.query.type;
  }
  const getPopup = await Popup.find(filter).sort({ createdAt: -1 });
  res.json(getPopup);
});

module.exports.updatePopup = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const updatedPopup = await Popup.findByIdAndUpdate(
    req.params.id,
    cleanBody(req.body),
    { new: true, runValidators: true }
  );
  res.json(orNotFound(updatedPopup, "Popup"));
});

module.exports.deletePopup = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const response = await Popup.findByIdAndDelete(req.params.id);
  res.json(orNotFound(response, "Popup"));
});

const asyncHandler = require("express-async-handler");
const Newsletter = require("../models/newsletterModel");
const { ensureValidId, orNotFound } = require("../utils/helpers");

// A duplicate email is turned into a 400 "already exists" error by errorMiddleware
module.exports.postNewsletter = asyncHandler(async (req, res) => {
  const insertNewsletter = await Newsletter.create({ email: req.body.email });
  res.status(201).json(insertNewsletter);
});

module.exports.getNewsletter = asyncHandler(async (req, res) => {
  const getNewsletter = await Newsletter.find().sort({ createdAt: -1 });
  res.json(getNewsletter);
});

module.exports.deleteNewsletter = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const deleteNewsletter = await Newsletter.findByIdAndDelete(req.params.id);
  res.json(orNotFound(deleteNewsletter, "Newsletter subscriber"));
});

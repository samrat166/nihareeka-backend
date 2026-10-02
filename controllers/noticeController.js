const asyncHandler = require("express-async-handler");
const Notice = require("../models/noticeModel");
const { cleanBody, ensureValidId, orNotFound } = require("../utils/helpers");

module.exports.postNotice = asyncHandler(async (req, res) => {
  const insertNotice = await Notice.create(cleanBody(req.body));
  res.status(201).json(insertNotice);
});

module.exports.getNotice = asyncHandler(async (req, res) => {
  const getNotice = await Notice.find().sort({ _id: -1 });
  res.json(getNotice);
});

module.exports.getSingleNotice = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  res.json(orNotFound(await Notice.findById(req.params.id), "Notice"));
});

module.exports.updateNotice = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const updatedNotice = await Notice.findByIdAndUpdate(
    req.params.id,
    cleanBody(req.body),
    { new: true, runValidators: true }
  );
  res.json(orNotFound(updatedNotice, "Notice"));
});

module.exports.deleteNotice = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const deleteNotice = await Notice.findByIdAndDelete(req.params.id);
  res.json(orNotFound(deleteNotice, "Notice"));
});

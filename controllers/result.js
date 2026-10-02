const asyncHandler = require("express-async-handler");
const ResultModel = require("../models/resultModel");
const { cleanBody, ensureValidId, orNotFound } = require("../utils/helpers");

module.exports.postResult = asyncHandler(async (req, res) => {
  const insertResult = await ResultModel.create(cleanBody(req.body));
  res.status(201).json(insertResult);
});

// Optional filter: GET /api/result?faculty=BBS
module.exports.getResult = asyncHandler(async (req, res) => {
  const filter = {};
  if (typeof req.query.faculty === "string") {
    filter.faculty = req.query.faculty;
  }
  const getResult = await ResultModel.find(filter).sort({ createdAt: -1 });
  res.json(getResult);
});

module.exports.updateResult = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const updatedResult = await ResultModel.findByIdAndUpdate(
    req.params.id,
    cleanBody(req.body),
    { new: true, runValidators: true }
  );
  res.json(orNotFound(updatedResult, "Result"));
});

module.exports.deleteResult = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const response = await ResultModel.findByIdAndDelete(req.params.id);
  res.json(orNotFound(response, "Result"));
});

const asyncHandler = require("express-async-handler");
const Faculty = require("../models/facultyMemberModel");
const { cleanBody, ensureValidId, orNotFound } = require("../utils/helpers");

module.exports.postFaculty = asyncHandler(async (req, res) => {
  const insertFaculty = await Faculty.create(cleanBody(req.body));
  res.status(201).json(insertFaculty);
});

module.exports.getFaculty = asyncHandler(async (req, res) => {
  const getFaculty = await Faculty.find().sort({ createdAt: -1 });
  res.json(getFaculty);
});

module.exports.updateFaculty = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const updatedFaculty = await Faculty.findByIdAndUpdate(
    req.params.id,
    cleanBody(req.body),
    { new: true, runValidators: true }
  );
  res.json(orNotFound(updatedFaculty, "Faculty member"));
});

module.exports.deleteFaculty = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const response = await Faculty.findByIdAndDelete(req.params.id);
  res.json(orNotFound(response, "Faculty member"));
});

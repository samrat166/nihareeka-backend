const asyncHandler = require("express-async-handler");
const Scholarship = require("../models/scholarshipModel");
const { cleanBody, ensureValidId, orNotFound } = require("../utils/helpers");

// Public visitors only see these fields; logged in users get everything
const PUBLIC_FIELDS = "studentName batch programEnrolled nationality";
const fieldsFor = (req) => (req.user ? "" : PUBLIC_FIELDS);

module.exports.postScholarship = asyncHandler(async (req, res) => {
  const insertScholarship = await Scholarship.create(cleanBody(req.body));
  res.status(201).json(insertScholarship);
});

// Optional filters: GET /api/v1/scholarship?batch=2080&programEnrolled=BCA
module.exports.getScholarships = asyncHandler(async (req, res) => {
  const filter = {};
  if (typeof req.query.batch === "string") {
    filter.batch = Number(req.query.batch);
  }
  if (typeof req.query.programEnrolled === "string") {
    filter.programEnrolled = req.query.programEnrolled;
  }
  const getScholarships = await Scholarship.find(filter)
    .select(fieldsFor(req))
    .sort({ createdAt: -1 });
  res.json(getScholarships);
});

module.exports.getSingleScholarship = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  res.json(
    orNotFound(
      await Scholarship.findById(req.params.id).select(fieldsFor(req)),
      "Scholarship"
    )
  );
});

module.exports.updateScholarship = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const updatedScholarship = await Scholarship.findByIdAndUpdate(
    req.params.id,
    cleanBody(req.body),
    { new: true, runValidators: true }
  );
  res.json(orNotFound(updatedScholarship, "Scholarship"));
});

module.exports.deleteScholarship = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const response = await Scholarship.findByIdAndDelete(req.params.id);
  res.json(orNotFound(response, "Scholarship"));
});

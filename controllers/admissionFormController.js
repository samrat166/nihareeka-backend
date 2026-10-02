const asyncHandler = require("express-async-handler");
const AdmissionForm = require("../models/admissionFormModel");
const { HttpError } = require("../middlewares/errorMiddleware");
const { cleanBody, ensureValidId, orNotFound } = require("../utils/helpers");

const ACCEPTANCE_STATUSES = ["pending", "accepted", "rejected"];

module.exports.postForm = asyncHandler(async (req, res) => {
  const body = cleanBody(req.body);
  delete body.acceptence; // a new form always starts as "pending"
  const insertForm = await AdmissionForm.create(body);
  res.status(201).json(insertForm);
});

module.exports.getForms = asyncHandler(async (req, res) => {
  const getForms = await AdmissionForm.find().sort({ createdAt: -1 });
  res.json(getForms);
});

module.exports.getSingleForm = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  res.json(
    orNotFound(await AdmissionForm.findById(req.params.id), "Admission form")
  );
});

// PUT /form/update/:id/:state  (state: "pending" | "accepted" | "rejected")
module.exports.updateFormStatus = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const acceptence = req.params.state;
  if (!ACCEPTANCE_STATUSES.includes(acceptence)) {
    throw new HttpError(
      `acceptence must be one of: ${ACCEPTANCE_STATUSES.join(", ")}`
    );
  }
  const updatedForm = await AdmissionForm.findByIdAndUpdate(
    req.params.id,
    { acceptence },
    { new: true }
  );
  res.json(orNotFound(updatedForm, "Admission form"));
});

module.exports.deleteForm = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const response = await AdmissionForm.findByIdAndDelete(req.params.id);
  res.json(orNotFound(response, "Admission form"));
});

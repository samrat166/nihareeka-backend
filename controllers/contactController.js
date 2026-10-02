const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const { setNotification } = require("./notificationController");
const { cleanBody, ensureValidId, orNotFound } = require("../utils/helpers");

module.exports.postContact = asyncHandler(async (req, res) => {
  const contact = await Contact.create(cleanBody(req.body));
  // Turn on the "new message" badge in the dashboard
  await setNotification(true);
  res.status(201).json({
    success: true,
    contact,
  });
});

module.exports.getContact = asyncHandler(async (req, res) => {
  const getContact = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: getContact.length,
    getContact,
  });
});

module.exports.getSingleContact = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const contact = orNotFound(await Contact.findById(req.params.id), "Contact");
  res.status(200).json({
    success: true,
    contact,
  });
});

module.exports.deleteContact = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  orNotFound(await Contact.findByIdAndDelete(req.params.id), "Contact");
  res.status(200).json({
    success: true,
    message: "Contact is deleted",
  });
});

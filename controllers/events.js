const asyncHandler = require("express-async-handler");
const Events = require("../models/events");
const { cleanBody, ensureValidId, orNotFound } = require("../utils/helpers");

module.exports.postEvents = asyncHandler(async (req, res) => {
  const insertEvents = await Events.create(cleanBody(req.body));
  res.status(201).json(insertEvents);
});

module.exports.getEvents = asyncHandler(async (req, res) => {
  const getEvents = await Events.find().sort({ createdAt: -1 });
  res.json(getEvents);
});

module.exports.getSingleEvent = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  res.json(orNotFound(await Events.findById(req.params.id), "Event"));
});

module.exports.updateEvents = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const updatedEvents = await Events.findByIdAndUpdate(
    req.params.id,
    cleanBody(req.body),
    { new: true, runValidators: true }
  );
  res.json(orNotFound(updatedEvents, "Event"));
});

module.exports.deleteEvents = asyncHandler(async (req, res) => {
  ensureValidId(req.params.id);
  const deleteEvents = await Events.findByIdAndDelete(req.params.id);
  res.json(orNotFound(deleteEvents, "Event"));
});

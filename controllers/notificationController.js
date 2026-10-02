const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");
const { HttpError } = require("../middlewares/errorMiddleware");

// There is only ever one notification document: an on/off switch for the site

const setNotification = (value) =>
  Notification.findOneAndUpdate(
    {},
    { notification: value },
    { new: true, upsert: true, runValidators: true }
  );

// Returned as an array, because the frontend reads data[0]
module.exports.getNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne();
  res.json([notification || { notification: false }]);
});

// PUT /notification/true or /notification/false
module.exports.updateNotification = asyncHandler(async (req, res) => {
  const { request } = req.params;
  if (request !== "true" && request !== "false") {
    throw new HttpError("notification must be true or false");
  }
  res.json(await setNotification(request === "true"));
});

module.exports.setNotification = setNotification;

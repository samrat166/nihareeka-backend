const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");
const { HttpError } = require("../middlewares/errorMiddleware");

// There is only ever one notification document: an on/off switch for the site

module.exports.getNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne();
  res.json(notification || { notification: false });
});

module.exports.updateNotification = asyncHandler(async (req, res) => {
  if (typeof req.body.notification !== "boolean") {
    throw new HttpError("notification must be true or false");
  }
  const notification = await Notification.findOneAndUpdate(
    {},
    { notification: req.body.notification },
    { new: true, upsert: true, runValidators: true }
  );
  res.json(notification);
});

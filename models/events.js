const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Please enter Your Name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter Your description"],
      trim: true,
    },
    pic: {
      type: String,
      required: [true, "Please insert images here"],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Events", eventSchema);

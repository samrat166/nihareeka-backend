const mongoose = require("mongoose");
const popupSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["carousel", "popup"],
      default: "popup",
    },
    pic: {
      type: String,
      required: [true, "Please enter image here"],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Popup", popupSchema);

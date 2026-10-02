const mongoose = require("mongoose");
const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter title"],
      trim: true,
      maxLength: [50, " Name cannot exceed 50 characters"],
    },
    pic: {
      type: String,
      required: [true, "Please enter image here"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Image Description Is Needed"],
      trim: true,
    },
    faculty: {
      type: String,
      required: [true, "Please Choose Some Faculty"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);

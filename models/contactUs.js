const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Your Name"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter Your Email"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Please enter message"],
      trim: true,
      maxLength: [500, "Message cannot exceed 500 character"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactUs", contactSchema);

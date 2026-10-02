const mongoose = require("mongoose");
const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name"],
      trim: true,
      maxLength: [50, " Name cannot exceed 50 characters"],
    },
    pic: {
      type: String,
      required: [true, "Please enter image here"],
      trim: true,
    },
    faculty: {
      type: String,
      required: [true, "Please Choose Some Faculty"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faculty", facultySchema);

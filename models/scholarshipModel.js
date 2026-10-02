const mongoose = require("mongoose");
const scholarshipSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Please enter student name"],
      trim: true,
    },
    batch: {
      type: Number,
      required: [true, "Please enter batch"],
    },
    programEnrolled: {
      type: String,
      required: [true, "Please enter program enrolled"],
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "Please enter father's name"],
      trim: true,
    },
    motherName: {
      type: String,
      required: [true, "Please enter mother's name"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter phone number"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Please enter address"],
      trim: true,
    },
    nationality: {
      type: String,
      required: [true, "Please enter nationality"],
      trim: true,
    },
    grade: {
      see: { type: String, trim: true },
      plus2: { type: String, trim: true },
      bachelor: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scholarship", scholarshipSchema);

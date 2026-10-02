const mongoose = require("mongoose");
const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter title"],
    trim: true,
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
});

module.exports = mongoose.model("Notice", noticeSchema);

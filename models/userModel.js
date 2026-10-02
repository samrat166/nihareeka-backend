const mongoose = require("mongoose");
const { ROLES } = require("../config/general");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/.test(v);
        },
        message: "Please enter a valid email",
      },
      trim: true,
      lowercase: true,
      unique: true,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(ROLES),
        message: `Role must be one of: ${Object.values(ROLES).join(", ")}`,
      },
      default: ROLES.USER,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // never returned unless explicitly asked for with .select("+password")
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      required: true,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);

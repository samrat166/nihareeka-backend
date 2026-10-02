// Creates the first SUPER ADMIN user from the SUPER_ADMIN_* values in .env.
// Runs automatically every time the server starts, and does nothing if a super admin already exists.
// Can also be run by hand: npm run seed

const User = require("../models/userModel");
const { ROLES, PASSWORD_MIN_LENGTH } = require("../config/general");
const { hashPassword } = require("../services/userServices");

const seedSuperAdmin = async () => {
  const existingSuperAdmin = await User.exists({ role: ROLES.SUPER_ADMIN });
  if (existingSuperAdmin) {
    return;
  }

  const name = process.env.SUPER_ADMIN_NAME;
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      "No super admin exists and SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD are not set. Skipping seed."
    );
    return;
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error(
      `SUPER_ADMIN_PASSWORD must be at least ${PASSWORD_MIN_LENGTH} characters long`
    );
  }

  // A user with this email already exists: promote them, keep their current password
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    existingUser.role = ROLES.SUPER_ADMIN;
    existingUser.active = true;
    await existingUser.save();
    console.log(`Existing user ${email} promoted to ${ROLES.SUPER_ADMIN}`);
    return;
  }

  await User.create({
    name,
    email,
    password: await hashPassword(password),
    role: ROLES.SUPER_ADMIN,
  });
  console.log(`${ROLES.SUPER_ADMIN} user created: ${email}`);
};

if (require.main === module) {
  require("dotenv").config({ quiet: true });
  const mongoose = require("mongoose");
  const { connectDB } = require("../config/db");

  connectDB()
    .then(seedSuperAdmin)
    .then(() => mongoose.disconnect())
    .catch(async (error) => {
      console.error(error);
      await mongoose.disconnect();
      process.exit(1);
    });
}

module.exports = { seedSuperAdmin };

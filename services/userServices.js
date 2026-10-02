const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/userModel");

const {
  ROLES,
  JWT_EXPIRES_IN,
  PASSWORD_MIN_LENGTH,
  BLOCK_AFTER_UNSUCCESSFUL_LOGIN_ATTEMPTS_COUNT,
  BLOCK_AFTER_UNSUCCESSFUL_LOGIN_ATTEMPTS_FOR_MINS,
} = require("../config/general");

const { HttpError } = require("../middlewares/errorMiddleware");

const BCRYPT_SALT_ROUNDS = 12;

// Used so a login for an unknown email takes as long as one for a known email
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("dummy-password", BCRYPT_SALT_ROUNDS);

const hashPassword = (password) => bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

const normalizeEmail = (email) => {
  if (typeof email !== "string" || !email.trim()) {
    throw new HttpError("Email is required");
  }
  return email.trim().toLowerCase();
};

const validatePassword = (password) => {
  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    throw new HttpError(
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`
    );
  }
};

const validateRole = (role) => {
  if (!Object.values(ROLES).includes(role)) {
    throw new HttpError(
      `Role must be one of: ${Object.values(ROLES).join(", ")}`
    );
  }
};

const ensureValidId = (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw new HttpError("Invalid user id");
  }
};

const generateToken = (id, expiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn,
    algorithm: "HS256",
  });
};

const loginService = async ({ email, password }) => {
  if (typeof email !== "string" || typeof password !== "string") {
    throw new HttpError("Email and password are required");
  }

  const invalidCredentialsMessage = "Invalid login credentials.";
  const lockedMessage =
    "Too many unsuccessful login attempts. Please try again later.";

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
    throw new HttpError(invalidCredentialsMessage, 401);
  }

  // Check if account is locked due to too many login attempts
  if (user.lockUntil && user.lockUntil > Date.now()) {
    throw new HttpError(lockedMessage, 429);
  }

  // Lock period is over, start counting again
  if (user.lockUntil) {
    user.loginAttempts = 0;
    user.lockUntil = null;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    user.loginAttempts++;
    if (user.loginAttempts >= BLOCK_AFTER_UNSUCCESSFUL_LOGIN_ATTEMPTS_COUNT) {
      user.lockUntil =
        Date.now() +
        BLOCK_AFTER_UNSUCCESSFUL_LOGIN_ATTEMPTS_FOR_MINS * 60 * 1000;
    }
    await user.save();
    throw new HttpError(invalidCredentialsMessage, 401);
  }

  if (!user.active) {
    throw new HttpError("Your account has been deactivated.", 403);
  }

  user.loginAttempts = 0;
  user.lockUntil = null;
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  return {
    token: generateToken(user._id),
    ...userObj,
  };
};

const changePasswordService = async ({ userId, oldPassword, newPassword }) => {
  if (typeof oldPassword !== "string" || !oldPassword) {
    throw new HttpError("Old password is required");
  }
  validatePassword(newPassword);

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new HttpError("User not found", 404);
  }

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    throw new HttpError("The old password is incorrect");
  }

  user.password = await hashPassword(newPassword);
  user.passwordChangedAt = new Date();
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  // Issue a fresh token, since tokens issued before the change are now invalid
  return { token: generateToken(user._id), ...userObj };
};

// ----- Super admin only: user management -----

const createUserService = async ({ name, email, password, role }, createdBy) => {
  const normalizedEmail = normalizeEmail(email);
  validatePassword(password);

  const userRole = role || ROLES.USER;
  validateRole(userRole);

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new HttpError("Email already exists", 400);
  }

  const createdUser = await User.create({
    name: typeof name === "string" ? name : undefined,
    email: normalizedEmail,
    password: await hashPassword(password),
    role: userRole,
    createdBy,
  });

  const userObj = createdUser.toObject();
  delete userObj.password;
  return userObj;
};

const getUsersService = async () => {
  return User.find().sort({ createdAt: -1 }).lean();
};

const getUserByIdService = async (userId) => {
  ensureValidId(userId);
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new HttpError("User not found", 404);
  }
  return user;
};

// Stops the system from ending up with no active super admin
const ensureAnotherSuperAdminExists = async (userId) => {
  const otherSuperAdmins = await User.countDocuments({
    _id: { $ne: userId },
    role: ROLES.SUPER_ADMIN,
    active: true,
  });
  if (otherSuperAdmins === 0) {
    throw new HttpError("There must always be at least one active super admin.");
  }
};

const updateUserService = async (userId, data, actingUser) => {
  ensureValidId(userId);
  const user = await User.findById(userId);
  if (!user) {
    throw new HttpError("User not found", 404);
  }

  const isSelf = user._id.equals(actingUser._id);
  const { name, email, role, active, password } = data;

  if (name !== undefined) {
    user.name = name;
  }

  if (email !== undefined) {
    const normalizedEmail = normalizeEmail(email);
    if (normalizedEmail !== user.email) {
      const emailTaken = await User.findOne({ email: normalizedEmail });
      if (emailTaken) {
        throw new HttpError("Email already exists", 400);
      }
      user.email = normalizedEmail;
    }
  }

  if (role !== undefined && role !== user.role) {
    validateRole(role);
    if (user.role === ROLES.SUPER_ADMIN) {
      if (isSelf) {
        throw new HttpError("You cannot change your own role.");
      }
      await ensureAnotherSuperAdminExists(user._id);
    }
    user.role = role;
  }

  if (active !== undefined && active !== user.active) {
    if (typeof active !== "boolean") {
      throw new HttpError("active must be true or false");
    }
    if (!active) {
      if (isSelf) {
        throw new HttpError("You cannot deactivate your own account.");
      }
      if (user.role === ROLES.SUPER_ADMIN) {
        await ensureAnotherSuperAdminExists(user._id);
      }
    }
    user.active = active;
  }

  // Super admin can set a new password for a user (there is no "forgot password" email flow)
  if (password !== undefined) {
    validatePassword(password);
    user.password = await hashPassword(password);
    user.passwordChangedAt = new Date();
    user.loginAttempts = 0;
    user.lockUntil = null;
  }

  await user.save();

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

const deleteUserService = async (userId, actingUser) => {
  ensureValidId(userId);
  const user = await User.findById(userId);
  if (!user) {
    throw new HttpError("User not found", 404);
  }

  if (user._id.equals(actingUser._id)) {
    throw new HttpError("You cannot delete your own account.");
  }
  if (user.role === ROLES.SUPER_ADMIN) {
    await ensureAnotherSuperAdminExists(user._id);
  }

  await user.deleteOne();
  return { success: true, message: "User deleted" };
};

module.exports = {
  hashPassword,
  loginService,
  changePasswordService,
  createUserService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
};

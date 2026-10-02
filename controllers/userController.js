const asyncHandler = require("express-async-handler");
const {
  loginService,
  changePasswordService,
  createUserService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} = require("../services/userServices");

const {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  JWT_EXPIRES_IN_MS,
} = require("../config/general");

const { sanitize } = require("../utils/responseSanitizer");

const setAuthCookie = (req, res, token) =>
  res.cookie(AUTH_COOKIE_NAME, token, {
    ...getAuthCookieOptions(req),
    maxAge: JWT_EXPIRES_IN_MS,
  });

const login = asyncHandler(async (req, res) => {
  const loggedInUser = await loginService(req.body);
  setAuthCookie(req, res, loggedInUser.token)
    .status(200)
    .json(sanitize(loggedInUser, "User", "All"));
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, getAuthCookieOptions(req));

  res.status(200).json({
    success: true,
    message: "Successfully logged out",
  });
});

const getMe = asyncHandler(async (req, res) =>
  res.status(200).json(sanitize(req.user, "User", req.user.role))
);

const changePassword = asyncHandler(async (req, res) => {
  const updatedUser = await changePasswordService({
    userId: req.user._id,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
  });
  setAuthCookie(req, res, updatedUser.token)
    .status(200)
    .json(sanitize(updatedUser, "User", "All"));
});

// ----- Super admin only -----

const createUser = asyncHandler(async (req, res) => {
  const createdUser = await createUserService(req.body, req.user._id);
  res.status(201).json(sanitize(createdUser, "User", "All"));
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await getUsersService();
  res.status(200).json(users.map((user) => sanitize(user, "User", "All")));
});

const getUserByID = asyncHandler(async (req, res) => {
  const userResult = await getUserByIdService(req.params.userId);
  res.status(200).json(sanitize(userResult, "User", "All"));
});

const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await updateUserService(
    req.params.userId,
    req.body,
    req.user
  );
  res.status(200).json(sanitize(updatedUser, "User", "All"));
});

const deleteUser = asyncHandler(async (req, res) =>
  res.status(200).json(await deleteUserService(req.params.userId, req.user))
);

module.exports = {
  login,
  logout,
  getMe,
  changePassword,
  createUser,
  getUsers,
  getUserByID,
  updateUser,
  deleteUser,
};

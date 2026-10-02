const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const { loginLimiter } = require("../middlewares/rateLimitMiddleware");
const { ROLES } = require("../config/general");

const {
  login,
  logout,
  getMe,
  changePassword,
  createUser,
  getUsers,
  getUserByID,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// There is no public registration. The super admin adds new users.

// user login
router.post("/login", loginLimiter, login);

router.route("/logout").get(logout).post(logout);

// profile section
router.get("/me", protect(), getMe);

router.post("/change-password", protect(), changePassword);

// ----- Super admin only: manage users -----
const superAdminOnly = [protect(), authorize(ROLES.SUPER_ADMIN)];

router
  .route("/")
  .get(superAdminOnly, getUsers)
  .post(superAdminOnly, createUser);

router
  .route("/:userId")
  .get(superAdminOnly, getUserByID)
  .patch(superAdminOnly, updateUser)
  .delete(superAdminOnly, deleteUser);

module.exports = router;

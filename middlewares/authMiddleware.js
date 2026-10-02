const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { AUTH_COOKIE_NAME } = require("../config/general");
const { HttpError } = require("./errorMiddleware");

// Read the JWT from the httpOnly cookie, falling back to an "Authorization: Bearer <token>" header
const getTokenFromRequest = (req) => {
  const cookieToken = req.cookies && req.cookies[AUTH_COOKIE_NAME];
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return null;
};

// Helper function to verify token and retrieve user
const verifyTokenAndGetUser = async (authToken) => {
  let decoded;
  try {
    decoded = jwt.verify(authToken, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (e) {
    throw new HttpError(
      e.name === "TokenExpiredError"
        ? "Session expired. Please log in again."
        : "Not authenticated",
      401
    );
  }

  const foundUser = await User.findById(decoded.id);

  if (!foundUser || !foundUser.active) {
    throw new HttpError("Not authenticated", 401);
  }

  // Tokens issued before the last password change are no longer valid
  if (
    foundUser.passwordChangedAt &&
    decoded.iat < Math.floor(foundUser.passwordChangedAt.getTime() / 1000)
  ) {
    throw new HttpError("Password was changed. Please log in again.", 401);
  }

  return foundUser.toObject();
};

// Allows the request through only for a logged in, active user
const protect = () => {
  return asyncHandler(async (req, res, next) => {
    const authToken = getTokenFromRequest(req);

    if (!authToken) {
      throw new HttpError("Not authenticated", 401);
    }

    req.user = await verifyTokenAndGetUser(authToken);

    next();
  });
};

// Use after protect(): allows the request through only for the given roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new HttpError("You do not have permission to do this.", 403);
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};

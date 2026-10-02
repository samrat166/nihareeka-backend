const ROLES = {
  SUPER_ADMIN: "SUPER ADMIN",
  USER: "USER",
};

const AUTH_COOKIE_NAME = "user-token";
const JWT_EXPIRES_IN = "7d";
const JWT_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;

const PASSWORD_MIN_LENGTH = 8;

const BLOCK_AFTER_UNSUCCESSFUL_LOGIN_ATTEMPTS_COUNT = 5;
const BLOCK_AFTER_UNSUCCESSFUL_LOGIN_ATTEMPTS_FOR_MINS = 15;

// In production the frontend and API live on different sites (e.g. the API on onrender.com),
// so the cookie must be SameSite=None to be sent with cross-site requests. That requires
// Secure (HTTPS). Partitioned keeps it working in browsers that block third-party cookies.
// CSRF is handled by the Origin check in server.js. Override with COOKIE_SAME_SITE if needed.
const COOKIE_SAME_SITE = (
  process.env.COOKIE_SAME_SITE ||
  (process.env.NODE_ENV === "production" ? "none" : "lax")
).toLowerCase();

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" || COOKIE_SAME_SITE === "none",
  sameSite: COOKIE_SAME_SITE,
  partitioned: COOKIE_SAME_SITE === "none",
  path: "/",
};

module.exports = {
  ROLES,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  JWT_EXPIRES_IN,
  JWT_EXPIRES_IN_MS,
  PASSWORD_MIN_LENGTH,
  BLOCK_AFTER_UNSUCCESSFUL_LOGIN_ATTEMPTS_COUNT,
  BLOCK_AFTER_UNSUCCESSFUL_LOGIN_ATTEMPTS_FOR_MINS,
};

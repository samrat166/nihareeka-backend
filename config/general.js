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

// When deployed (HTTPS), the frontend and API live on different sites (e.g. the API on
// onrender.com), so the cookie must be SameSite=None to be sent with cross-site requests.
// That requires Secure. Partitioned keeps it working in browsers that block third-party cookies.
// Over plain HTTP (local development) it falls back to SameSite=Lax.
// This is decided per request, so it works even if NODE_ENV isn't set on the host.
// CSRF is handled by the Origin check in server.js. Override with COOKIE_SAME_SITE if needed.
const getAuthCookieOptions = (req) => {
  const sameSite = (
    process.env.COOKIE_SAME_SITE || (req.secure ? "none" : "lax")
  ).toLowerCase();

  return {
    httpOnly: true,
    secure: req.secure || sameSite === "none",
    sameSite,
    partitioned: sameSite === "none",
    path: "/",
  };
};

module.exports = {
  ROLES,
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  JWT_EXPIRES_IN,
  JWT_EXPIRES_IN_MS,
  PASSWORD_MIN_LENGTH,
  BLOCK_AFTER_UNSUCCESSFUL_LOGIN_ATTEMPTS_COUNT,
  BLOCK_AFTER_UNSUCCESSFUL_LOGIN_ATTEMPTS_FOR_MINS,
};

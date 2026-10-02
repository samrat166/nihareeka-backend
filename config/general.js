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

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "strict", // This helps protect against CSRF
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

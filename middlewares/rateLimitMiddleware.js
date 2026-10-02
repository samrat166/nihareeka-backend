const { rateLimit } = require("express-rate-limit");

// Slows down password guessing: 10 login attempts per IP every 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

// General limit for the whole API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

module.exports = { loginLimiter, apiLimiter };

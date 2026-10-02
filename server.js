if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ quiet: true });
}

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const http = require("http");

const registerRoutes = require("./routes");

const { connectDB } = require("./config/db");
const { seedSuperAdmin } = require("./scripts/seedSuperAdmin");
const {
  errorHandler,
  notFound,
  HttpError,
} = require("./middlewares/errorMiddleware");
const { mongoSanitize } = require("./middlewares/sanitizeMiddleware");
const { apiLimiter } = require("./middlewares/rateLimitMiddleware");

// Refuse to start without the settings the app can't run safely without
["MONGO_URI", "JWT_SECRET"].forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const port = process.env.PORT || 5000;

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware setup
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet());
app.use(cookieParser());

// Set up CORS configuration
// Allowed origins: BASEURL plus any extra comma-separated ones in CORS_ORIGINS.
// In development (NODE_ENV=development), any http://localhost:<port> or http://127.0.0.1:<port> is also allowed.
const allowedOrigins = [process.env.BASEURL, process.env.CORS_ORIGINS]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const isLocalDevOrigin = (origin) =>
  process.env.NODE_ENV === "development" &&
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

const isAllowedOrigin = (origin) =>
  allowedOrigins.includes(origin) || isLocalDevOrigin(origin);

const corsOptions = {
  origin: (origin, callback) => {
    // Requests without an Origin header (Postman, curl, server-to-server) are allowed
    if (!origin || isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    console.warn(`CORS: blocked request from origin ${origin}`);
    callback(null, false);
  },
  credentials: true, // Allow cookies
};

app.use(cors(corsOptions));

// CSRF protection: the login cookie is sent cross-site (SameSite=None), so a request that
// changes data is only accepted from an allowed origin. Browsers always send the Origin
// header on cross-site POST/PUT/PATCH/DELETE; tools like Postman send none and are allowed.
app.use((req, res, next) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  const origin = req.headers.origin;
  if (!safeMethods.includes(req.method) && origin && !isAllowedOrigin(origin)) {
    console.warn(`CSRF: blocked ${req.method} ${req.originalUrl} from origin ${origin}`);
    return next(new HttpError("Request origin not allowed", 403));
  }
  next();
});
app.use(apiLimiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

// Strip "$" / "." keys from user input to block NoSQL injection
app.use(mongoSanitize);

// Route Registration
registerRoutes(app);

// Unknown routes -> 404, then error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to the database and seed the super admin before accepting requests
const startServer = async () => {
  await connectDB();
  await seedSuperAdmin();

  server.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

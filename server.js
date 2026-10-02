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
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
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
const corsOptions = {
  origin: process.env.BASEURL,
  credentials: true, // Allow cookies
};

app.use(cors(corsOptions));
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

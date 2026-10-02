const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || res.statusCode || 500;

  if (statusCode >= 200 && statusCode < 300) {
    statusCode = 500;
  }

  let message = "";

  if (err.code === 11000) {
    statusCode = 400;
    message = `The provided ${
      Object.keys(err.keyValue)[0]
    } already exists in our system`;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  } else if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON in request body";
  } else if (statusCode >= 500 && process.env.NODE_ENV === "production") {
    // Don't leak internal error details to clients in production
    message = "Something went wrong";
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode);
  res.json({
    message: message || err.message,
    stack: process.env.NODE_ENV == "production" ? null : err.stack,
  });
};

const notFound = (req, res, next) => {
  next(new HttpError(`Not found - ${req.originalUrl}`, 404));
};

class HttpError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = {
  errorHandler,
  notFound,
  HttpError,
};

// Protects against NoSQL injection, e.g. { "email": { "$gt": "" } } in a login request.
// Removes any object key that starts with "$" or contains "." from req.body.
// (express-mongo-sanitize does not work with Express 5, because req.query is read-only there.
// Express 5's default query parser never creates nested objects, and route params are
// always plain strings, so req.query and req.params are already safe.)

const cleanObject = (value) => {
  if (Array.isArray(value)) {
    return value.map(cleanObject);
  }
  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete value[key];
      } else {
        value[key] = cleanObject(value[key]);
      }
    }
  }
  return value;
};

const mongoSanitize = (req, res, next) => {
  if (req.body) cleanObject(req.body);
  next();
};

module.exports = { mongoSanitize };

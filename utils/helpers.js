const mongoose = require("mongoose");
const { HttpError } = require("../middlewares/errorMiddleware");

// Fields a client must never set directly when creating/updating a document
const PROTECTED_FIELDS = ["_id", "__v", "createdAt", "updatedAt"];

const cleanBody = (body = {}) => {
  const cleaned = { ...body };
  PROTECTED_FIELDS.forEach((field) => delete cleaned[field]);
  return cleaned;
};

const ensureValidId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError("Invalid id");
  }
};

// Throws a 404 when the document doesn't exist
const orNotFound = (doc, name = "Item") => {
  if (!doc) {
    throw new HttpError(`${name} not found`, 404);
  }
  return doc;
};

module.exports = {
  cleanBody,
  ensureValidId,
  orNotFound,
};

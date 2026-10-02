// Route prefixing based on environment
const isTestServer = process.env.IS_TEST_SERVER;
const routePrefix = isTestServer ? `test-` : "";

const userRoutes = require("./userRoutes");
const eventRoutes = require("./eventRoutes");
const facultyMemberRoutes = require("./facultyMemberRoutes");
const galleryRoutes = require("./galleryRoutes");
const noticeRoutes = require("./noticeRoutes");
const notificationRoutes = require("./notificationRoutes");
const popupRoutes = require("./popupRoutes");
const resultRoutes = require("./resultRoutes");
const contactRoutes = require("./contactRoutes");
const newsletterRoutes = require("./newsletterRoutes");
const admissionFormRoutes = require("./admissionFormRoutes");

const registerRoutes = (app) => {
  const api = `/${routePrefix}api`;

  app.use(`${api}/user`, userRoutes);

  // Public GET, everything else requires login
  app.use(`${api}/events`, eventRoutes);
  app.use(`${api}/faculty`, facultyMemberRoutes);
  app.use(`${api}/gallery`, galleryRoutes);
  app.use(`${api}/notice`, noticeRoutes);
  app.use(`${api}/notification`, notificationRoutes);
  app.use(`${api}/popup`, popupRoutes);
  app.use(`${api}/result`, resultRoutes);

  // Fully protected
  app.use(`${api}/contact`, contactRoutes);
  app.use(`${api}/newsletter`, newsletterRoutes);
  app.use(`${api}/admission-form`, admissionFormRoutes);

  return app;
};

module.exports = registerRoutes;

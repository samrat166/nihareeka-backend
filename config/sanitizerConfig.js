const sanitizerConfig = {
  User: {
    All: {
      mode: "blacklist",
      paths: [
        "password",
        "passwordChangedAt",
        "loginAttempts",
        "lockUntil",
        "__v",
      ],
    },
  },
  // other models here...
};

module.exports = sanitizerConfig;

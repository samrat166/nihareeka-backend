const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 6000, // Timeout after 6 seconds
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = { connectDB };

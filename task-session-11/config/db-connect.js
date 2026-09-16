const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connStr = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/task11_db";
    await mongoose.connect(connStr, {
      dbName: process.env.DB_NAME || "task11_db",
    });
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(`Database Connection Error: ${error.message}`);
  }
};

module.exports = dbConnect;

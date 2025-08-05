import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//database connection
const dbConnection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/bikroy-dot-com-db");
    console.log("✅ MongoDB database connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
};

export default dbConnection;

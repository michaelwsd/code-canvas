import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" })
const uri = process.env.MONGO_URI;

if (!uri) {
    throw new Error("❌ MONGO_URI is not defined in .env.local");
  }

export async function connectDB() {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB connected");
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    }
  }

  
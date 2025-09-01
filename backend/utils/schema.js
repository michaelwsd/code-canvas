import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    roomId: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    socketId: { type: String, required: true, unique: true },
  }, { timestamps: true });
  
export const User = mongoose.model("User", userSchema);
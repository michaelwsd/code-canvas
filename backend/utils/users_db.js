import { User } from "./schema.js";

// Add user
export const addUser = async ({ username, roomId, userId, socketId }) => {
  const newUser = new User({ username, roomId, userId, socketId });
  await newUser.save();
  return getUsersInRoom(roomId);
};

// Remove user
export const removeUser = async (socketId) => {
  const user = await User.findOneAndDelete({ socketId });
  return user; // returns deleted user
};

// Get single user
export const getUser = async (socketId) => {
  return await User.findOne({ socketId });
};

// Get all users in a room
export const getUsersInRoom = async (roomId) => {
  return await User.find({ roomId });
};

// Get all users
export const getAllUsers = async () => {
  return await User.find({});
};

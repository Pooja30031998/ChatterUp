import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  name: String,
  userImage: String,
  room: String,
  message: String,
  dateTime: Date,
});

const ChatModel = mongoose.model("chat", chatSchema);

export default ChatModel;

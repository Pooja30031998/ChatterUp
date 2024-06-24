import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  customId: String,
  name: String,
  userImage: String,
  room: String,
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;

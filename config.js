import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const baseUrl = process.env.MONGODB;

export const connectMongoDb = async () => {
  try {
    await mongoose.connect(baseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB is connected");
  } catch (err) {
    console.log(err);
  }
};

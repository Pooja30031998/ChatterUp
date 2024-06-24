import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import path from "path";
import { connectMongoDb } from "./config.js";
import UserModel from "./user-schema.js";
import ChatModel from "./chat-schema.js";

const app = express();
app.use(cors());
app.use(express.static(path.join(path.resolve(), "public")));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connection is made");

  //listening to event to add user details to database
  socket.on("userDetails", async (data) => {
    socket.userData = {
      name: data.userName,
      room: data.room,
      image: data.userImage,
    };
    //adding user details to database
    try {
      const newUser = new UserModel({
        customId: socket.id,
        name: data.userName,
        userImage: data.userImage,
        room: data.room,
      });
      await newUser.save();
    } catch (err) {
      console.log(err);
    }

    //joining user to room
    socket.join(data.room);

    //getting online users and emitting the event
    const getRoomUsers = await UserModel.find({ room: data.room });
    io.to(data.room).emit("roomUsers", {
      total: getRoomUsers.length,
      users: getRoomUsers,
    });

    //getting previous messages and emitting event
    const previosMessages = await ChatModel.find({ room: data.room });
    socket.emit("roomUsersMessages", previosMessages);
  });

  //listening to new mw=essages and adding to database
  socket.on("sendMessage", async (data) => {
    const newChat = new ChatModel({
      name: data.userName,
      userImage: data.userImage,
      room: socket.userData.room,
      message: data.message,
      dateTime: new Date(),
    });
    await newChat.save();

    //broadcasting new messages to all other users
    socket.broadcast.to(socket.userData.room).emit("broadcast-message", data);
  });

  //listening to user typing event and broadcasting it to all users
  socket.on("feedback", (data) => {
    socket.broadcast.to(socket.userData.room).emit("feedback", data);
  });

  //listening to disconnect event and emitting event to indicate that the user is disconnected
  socket.on("disconnect", async () => {
    console.log("connection is disconnected");
    const userLeave = await UserModel.findOneAndDelete({ customId: socket.id });
    if (userLeave) {
      const getRoomUsers = await UserModel.find({ room: socket.userData.room });
      io.to(socket.userData.room).emit("roomUsers", {
        total: getRoomUsers.length,
        users: getRoomUsers,
      });
    }
  });
});

server.listen("3000", () => {
  console.log("server is listening to port 3000");
  connectMongoDb();
});

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import db from "./src/config/db";
import route from "./src/routes";

import http from "http";
import socketIo from "socket.io";

import MessageService from "./src/services/MessageService";

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server);
// Cấu hình cors : chia sẻ nguồn tài nguyên cho người khác
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Cookie-parse
app.use(cookieParser());

// Xử lí form post lên
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Thư viện morgan
app.use(morgan("combined"));

// Kết nối database
db.connect();

route(app);

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", async (data) => {
    console.log("rooom", room);
    const { room } = data;
    const res = await MessageService.createRoom({ userOne: room });
    console.log("res >>>>.", res);
    if (res) {
      socket.join(room);
      socket.emit("room_created", res.DT.id);
    }
  });

  socket.on("send_message", async (data) => {
    const { text, room, ID_User } = data;

    // luu vo database
    const res = await MessageService.create({ text, ID_Room: room, ID_User });
    console.log("res", res);
    if (res && res.EC == 0) {
      socket.emit("receive_message", res.DT);
    }
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

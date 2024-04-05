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
    const { ID_User, room } = data;
    const res = await MessageService.createRoom({ userOne: ID_User });
    if (res) {
      socket.join(+res.DT.id);
      console.log("tham gia phong chat : ", res.DT.id);
      socket.emit("room_created", res.DT.id);
    }
  });

  socket.on("join_room_admin", async (data) => {
    const { room } = data;

    socket.join(+room);
    socket.emit("room_created", room);
    console.log("admin tham gia phong chat : ", room);
  });

  socket.on("send_message", async (data) => {
    const { text, room, ID_User } = data;
    console.log("đata create", data);
    // socket.broadcast.emit("receive_message", data);
    socket.to(room).emit("receive_message", data);
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

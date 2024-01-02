import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
const app = express();
const port = 3000

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

 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)  
})
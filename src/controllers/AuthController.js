import AuthService from "../services/AuthService";
import jwt from "jsonwebtoken";
import bcrypt, { genSaltSync } from "bcrypt";
const salt = genSaltSync(10);

class Auth {
  // [POST] /api/v1/authentication/register
  async register(req, res) {
    try {
      const { username, email, phone, password, role } = req.body;
      // Validate
      if (!username || !email || !phone || !password) {
        return res.status(200).json({
          EM: "Nhập thiếu dữ liệu !!!",
          EC: "-1",
          DT: "",
        });
      }

      // Create User
      const data = await AuthService.handleRegister(req.body);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      return res.status(500).json({
        EM: "error server", // error message
        EC: "-5", // error code
        DT: [], // data
      });
    }
  }

  // [POST] /api/v1/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(200).json({
          EM: "Nhập thiếu dữ liệu !!!",
          EC: -2,
          DT: [],
        });
      }

      let data = await AuthService.handleLogin({
        email,
        password,
      });

      if (data.EC === 0) {
        return res
          .cookie("refreshToken", data.DT.refreshToken, {
            sameSite: "none",
            secure: true,
            httpOnly: true,
          })
          .json({ EM: data.EM, EC: data.EC, DT: data.DT });
      }

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server",
        EC: "-5",
        DT: [],
      });
    }
  }

  // [GET] /api/v1/auth/logout
  async logout(req, res) {
    const refresh_token = req.cookies.refreshToken;

    if (!refresh_token) {
      return res.status(401).json("Bạn chưa đăng nhập");
    }

    try {
      res.clearCookie("refreshToken");
      return res.status(200).json({
        EM: "Đăng xuất thành công",
        EC: 0,
        DT: [],
      });
    } catch (err) {
      return res.status(500).json({ EM: "Lỗi server", EC: -5, DT: [] });
    }
  }

  // [GET]  /api/v1/auth/fetchProfile
  async fetchProfile(req, res) {
    try {
      const authToken = req.headers.authorization;

      if (!(authToken && authToken.startsWith("Bearer "))) {
        return res
          .status(401)
          .json({ EM: "Người dùng chưa đăng nhập [Không tìm thấy token] " });
      }

      const accessToken = authToken.split(" ")[1];
      const dataUser = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      return res.status(200).json({
        EM: "FetchProfile thành công",
        EC: 0,
        DT: dataUser,
      });
    } catch (err) {
      return res.status(401).json({ EM: "Token hết hạn hoặc không hợp lệ" });
    }
  }

  //[GET] /api/v1/auth/refresh
  async refresh(req, res) {
    try {
      const refreshToken = req.cookie?.refreshToken; // Token gửi từ client
      if (!refreshToken) {
        return res.status(401).json({ EM: "Người dùng chưa đăng nhập" });
      }

      const refreshTokenVerify = jwt.verify(
        refreshToken,
        process.env.REFERSH_TOKEN_SECRET
      );

      if (!refreshTokenVerify) {
        return res.status(401).json({ message: "Invalid refresh token." });
      }

      // Kím ra user //// Kiểm tra refetch token trong db
      let userToken = null;
      userToken = await db.Customer.findOne({
        id: refreshTokenVerify.id,
      });
      if (userToken == null) {
        userToken = await db.Staff.findOne({
          id: refreshTokenVerify.id,
        });
      }

      if (!userToken) {
        return res.status(401).json({ EM: "Người dùng chưa đăng nhập" });
      }

      console.log(">>>>>>>>>> userToken", userToken);

      // Tạo ra token mới (access token)
      const newAccessToken = jwt.sign(
        {
          /* Dữ liệu muốn lưu trong token */
          id: userToken.id,
          username: userToken.username,
          phone: userToken.phone,
          email: userToken.email,
          role: userToken.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60s" }
      );

      // Gửi access token mới về cho client
      return res.json({ accessToken: newAccessToken });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server",
        EC: "-5",
        DT: [],
      });
    }
  }
  
  async test(req, res) {
    return res.json("test");
  }
}

export default new Auth();

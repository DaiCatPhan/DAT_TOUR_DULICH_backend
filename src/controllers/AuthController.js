import AuthService from "../services/AuthService";
import jwt from "jsonwebtoken";
import bcrypt, { genSaltSync } from "bcrypt";
import db from "../app/models";
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
          EC: -2,
          DT: [],
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

  // [POST] /api/v1/auth/logout
  async logout(req, res) {
    const refresh_token = req.cookies.refreshToken;

    if (!refresh_token) {
      return res.status(401).json({
        EM: "Không có refreshToken hoặc bạn chưa đăng nhập",
        EC: -2,
        DT: [],
      });
    }

    try {
      // Kiểm tra trong db coi có refreshToken không ?
      const refreshTokenVerify = jwt.verify(
        refresh_token,
        process.env.REFERSH_TOKEN_SECRET
      );

      if (!refreshTokenVerify) {
        return res.status(403).json({ EM: "Invalid refresh token." });
      }

      let userToken = null;
      userToken = await db.Customer.findOne({
        id: refreshTokenVerify.id,
        refreshToken: refreshTokenVerify.refresh_Token,
      });

      if (!userToken) {
        return res.status(401).json({
          EM: "Người dùng chưa đăng nhập , refreshToken không hợp lệ",
        });
      }

      // Xóa refreshToken ở db

      await db.Customer.update(
        { refresh_token: "" },
        {
          where: {
            id: userToken.id,
          },
        }
      );

      // Xóa refreshToken ở cookie
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

      if (!(authToken && authToken.startsWith("Bearer"))) {
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
      return res.status(403).json({ EM: "Token hết hạn hoặc không hợp lệ" });
    }
  }

  //[POST] /api/v1/auth/refresh
  async refresh(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken; // Token gửi từ client

      if (!refreshToken) {
        return res.status(401).json({ EM: "Người dùng chưa đăng nhập" });
      }

      const refreshTokenVerify = jwt.verify(
        refreshToken,
        process.env.REFERSH_TOKEN_SECRET
      );

      if (!refreshTokenVerify) {
        return res.status(403).json({ message: "Refresh token không hợp lệ." });
      }

      const userToken = await db.Customer.findOne({
        where: {
          id: refreshTokenVerify?.id,
        },
        raw: true,
      });

      if (!userToken) {
        return res.status(401).json({
          EM: "Người dùng chưa đăng nhập , refreshToken không hợp lệ",
        });
      }

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
      return res
        .status(200)
        .json({ EC: 0, EM: "retry thành công ", DT: newAccessToken });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(403).json({
        EM: "Token lỗi hoặc hết hạn",
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

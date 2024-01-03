import AuthService from "../services/AuthService";
import jwt from "jsonwebtoken";
import bcrypt, { genSaltSync } from "bcrypt";
const salt = genSaltSync(10);

class Auth {
  // [POST] /api/v1/authentication/register
  async register(req, res) {
    try {
      const { username, email, phone, password } = req.body;

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
          EC: "1",
          DT: "",
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

  async logout(req, res) {
    res.json("logout");
  }
  async getProfile(req, res) {
    res.json("getProfile");
  }

  //[POST] /api/v1/auth/refresh
  async refresh(req, res) {
    try {
      const refreshToken = req.body.refreshToken; // Token gửi từ client
      if (!refreshToken) {
        return res.status(401).json({ message: "You are not authenticated!" });
      }

      // Kiểm tra tính hợp lệ của refreshToken
      jwt.verify(
        refreshToken,
        process.env.REFERSH_TOKEN_SECRET,
        (err, user) => {
          if (err) {
            console.log("err>>>", err);
            return res.status(403).json({ message: "Invalid refresh token." });
          }

          // Tạo ra token mới (access token)
          const newAccessToken = jwt.sign(
            {
              /* Dữ liệu muốn lưu trong token */
              id: user.id,
              username: user.username,
              phone: user.phone,
              email: user.email,
              role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "60s" }
          );

          // Gửi access token mới về cho client
          res.json({ accessToken: newAccessToken });  
        }
      );
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

import { Model } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt, { genSaltSync } from "bcrypt";
import db from "../app/models";
import { Op } from "sequelize";
import "dotenv/config";

const salt = genSaltSync(10);

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compare(inputPassword, hashPassword);
};

const getUserLogin = async (email) => {
  let user = null;

  user = await db.Customer.findOne({
    where: {
      email: email,
    },
    raw: true,
  });

  return user;
};

const checkEmailExist = async (userEmail) => {
  let user = null;

  user = await db.Customer.findOne({
    where: {
      email: userEmail,
    },
  });

  if (user === null) {
    return false;
  }
  return true; //  Email có tồn tại
};

const handleRegister = async (rawUserData) => {
  const { username, email, phone, password, role } = rawUserData;

  try {
    // B1
    let isEmailExitst = await checkEmailExist(email);

    if (isEmailExitst === true) {
      return {
        EM: "Email đã tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }

    // B2
    let hashPassword = hashUserPassword(password);
    // B3
    const condition = {};
    if (username) {
      condition.username = username;
    }
    if (email) {
      condition.email = email;
    }
    if (phone) {
      condition.phone = phone;
    }
    if (password) {
      condition.password = hashPassword;
    }
    if (role) {
      condition.role = role;
    }

    const data = await db.Customer.create(condition);

    return {
      EM: "Đăng ký tài khoản thành công",
      EC: 0,
      DT: data,
    };
  } catch (err) {
    console.log(">>> err ", err);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

const handleLogin = async (rawData) => {
  try {
    const user = await getUserLogin(rawData.email);

    if (user === null) {
      return {
        EM: "Thông tin đăng nhập không đúng !!",
        EC: -2,
        DT: [],
      };
    }

    let isCorrectPassword = await checkPassword(
      rawData.password,
      user.password
    );

    if (isCorrectPassword === true) {
      let tokentData = {
        id: user.id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        address: user.address,
      };

      const accessToken = jwt.sign(
        tokentData,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "60s",
        }
      );

      const refreshToken = jwt.sign(
        tokentData,
        process.env.REFERSH_TOKEN_SECRET
      );

      // luu refetchToken vao db

      await db.Customer.update(
        { refresh_token: refreshToken },
        {
          where: {
            id: user.id,
          },
        }
      );

      return {
        EM: "ok",
        EC: 0,
        DT: {
          tokentData,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      };

      // Tiếp tục
    } else {
      return {
        EM: "  Thông tin đăng nhập không đúng !!!",
        EC: -2,
        DT: [],
      };
    }
  } catch (err) {
    console.log(">>> err", err);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

export default { handleLogin, handleRegister };

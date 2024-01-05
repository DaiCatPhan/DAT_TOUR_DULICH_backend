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
  user = await db.Staff.findOne({
    where: {
      email: email,
    },
    raw: true,
  });

  if (user === null) {
    user = await db.Customer.findOne({
      where: {
        email: email,
      },
      raw: true,
    });
  }

  return user;
};

const checkEmailExist = async (userEmail) => {
  let user = null;

  user = await db.Staff.findOne({
    where: {
      email: userEmail,
    },
  });

  if (user === null) {
    user = await db.Customer.findOne({
      where: {
        email: userEmail,
      },
    });
  }

  if (user === null) {
    return false;
  }
  return true; //  Email có tồn tại
};

const handleRegister = async (rawUserData) => {
  // B1. kiểm tra email  -> B2. hashpassword -> B3. create new user
  try {
    // B1
    let isEmailExitst = await checkEmailExist(rawUserData.email);

    if (isEmailExitst === true) {
      return {
        EM: "Email đã tồn tại !!!",
        EC: -1,
        DT: [],
      };
    }

    // B2
    let hashPassword = hashUserPassword(rawUserData.password);
    // B3
    if (rawUserData.role) {
      await db.Staff.create({
        email: rawUserData.email,
        username: rawUserData.username,
        phone: rawUserData.phone,
        password: hashPassword,
        role: rawUserData.role,
      });
    } else {
      await db.Customer.create({
        email: rawUserData.email,
        username: rawUserData.username,
        phone: rawUserData.phone,
        password: hashPassword,
      });
    }

    return {
      EM: "Taì khoản thành công",
      EC: 0,
      DT: [],
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
    var user = await getUserLogin(rawData.email);

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
      };

      const accsessToken = jwt.sign(
        tokentData,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "30s",
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
          accsessToken: accsessToken,
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
      DT: "",
    };
  }
};

export default { handleLogin, handleRegister };

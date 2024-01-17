import db from "../app/models";
import bcrypt, { genSaltSync } from "bcrypt";
const salt = genSaltSync(10);

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
  return true;
};

const checkPhoneExist = async (userPhone) => {
  let user = null;

  user = await db.Staff.findOne({
    where: {
      phone: userPhone,
    },
  });

  if (user === null) {
    user = await db.Customer.findOne({
      where: {
        phone: userPhone,
      },
    });
  }

  if (user === null) {
    return false;
  }
  return true;
};

const hashUserPassword = async (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};

const createNewUser = async (rawUserData) => {
  const { username, email, role, address, phone, password } = rawUserData;
  try {
    let isEmailExitst = await checkEmailExist(email);
    let isPhoneExitst = await checkPhoneExist(phone);
    if (isEmailExitst === true) {
      return {
        EM: "Email đã tồn tại !!!",
        EC: -1,
        DT: [],
      };
    }

    if (isPhoneExitst === true) {
      return {
        EM: "Số điện thoại đã tồn tại !!!",
        EC: -1,
        DT: [],
      };
    }

    // B2
    let hashPassword = await hashUserPassword(password);

    // B3

    let userNewData = await db.Staff.create({
      email: email,
      username: username,
      phone: phone,
      role: role,
      address: address,
      password: hashPassword,
    });

    return {
      EM: "Tạo tài  khoản thành công",
      EC: 0,
      DT: userNewData,
    };
  } catch (err) {
    console.log("err <<<>>> ", err);

    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

const updateStaff = async (rawUserData) => {
  let { id, username, email, role, address, phone, status } = rawUserData;

  try {
    let isIdExitst = await db.Staff.findByPk(id);
    if (!isIdExitst) {
      return {
        EM: "Tài khoản (id) không tồn tại !!!",
        EC: 1,
        DT: "",
      };
    }

    let updateUserData = await db.Staff.update(
      {
        username: username,
        email: email,
        role: role,
        phone: phone,
        address: address,
        phone: phone,
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return {
      EM: "Cập nhật tài khoản thành công",
      EC: 0,
      DT: updateUserData,
    };
  } catch (err) {
    console.log(">> loi", err);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

export default { createNewUser, updateStaff };

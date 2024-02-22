import db from "../app/models";

const readAllCustomer = async (rawData) => {
  const { email, username, page, limit } = rawData;

  try {
    const offset = (page - 1) * limit;
    const whereCondition = {};
    if (username) {
      whereCondition.username = { [Op.like]: `%${username}%` };
    }

    if (email) {
      whereCondition.email = { [Op.like]: `%${email}%` };
    }

    const options = {
      where: whereCondition,
      limit: limit ? parseInt(limit) : undefined,
      offset: limit && page ? parseInt(offset) : undefined,
      order: [["createdAt", "DESC"]],
      //   include: [
      //     {
      //       model: db.Calendar,
      //     },
      //     { model: db.ProcessTour },
      //   ],
    };

    const { count, rows } = await db.Customer.findAndCountAll(options);
    let data = {
      totalRows: count,
      users: rows,
    };
    return {
      EM: "Lấy dữ liệu thành công ",
      EC: 0,
      DT: data,
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

const readCustomer = async (rawData) => {
  const { id } = rawData;

  try {
    const whereCondition = {};
    if (id) {
      whereCondition.id = id;
    }

    const options = {
      where: whereCondition,
      //   include: [
      //     {
      //       model: db.Calendar,
      //     },
      //     { model: db.ProcessTour },
      //   ],
    };

    const data = await db.Customer.findOne(options);
    if (!data) {
      return {
        EM: "Người dùng không tồn tại  ",
        EC: -2,
        DT: [],
      };
    }
    return {
      EM: "Lấy dữ liệu thành công ",
      EC: 0,
      DT: data,
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

const updateCustomer = async (rawUserData, imageUrl) => {
  try {
    let isIdExitst = await checkIdExist(rawUserData.id);

    if (isIdExitst !== true) {
      return {
        EM: "Tài khoản (id) không tồn tại !!!",
        EC: 1,
        DT: "",
      };
    }

    const objectUpdate = {};

    imageUrl && (objectUpdate.image = imageUrl);
    console.log(">> objectUpdate", objectUpdate);

    let updateUserData = await db.Staff.update(
      {
        name: rawUserData.name,
        phone: rawUserData.phone,
        gender: rawUserData.gender,
        role: rawUserData.role,
        email: rawUserData.email,
        ...objectUpdate,
      },
      {
        where: {
          id: rawUserData.id,
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
      EC: -2,
      DT: "",
    };
  }
};

export default { readAllCustomer, updateCustomer, readCustomer };

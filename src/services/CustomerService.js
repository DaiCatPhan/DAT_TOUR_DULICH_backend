import { Op } from "sequelize";
import db from "../app/models";

const readAllCustomer = async (rawData) => {
  const { role, phone, email, username, page, limit } = rawData;

  try {
    const offset = (page - 1) * limit;
    const whereCondition = {};
    if (role) {
      if (role == "!khách hàng") {
        whereCondition.role = { [Op.ne]: "khách hàng" };
      } else {
        whereCondition.role = { [Op.like]: `%${role}%` };
      }
    }

    if (username) {
      whereCondition.username = { [Op.like]: `%${username}%` };
    }

    if (phone) {
      whereCondition.phone = { [Op.like]: `%${phone}%` };
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
      include: [
        {
          model: db.VoucherUser,
          include: { model: db.Voucher },
        },
        // { model: db.ProcessTour },
      ],
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

const updateCustomer = async (rawData) => {
  const { id, username, address, email, phone, role, status } = rawData;

  try {
    let customer = await db.Customer.findByPk(id);
    if (!customer) {
      return {
        EM: "Tài khoản  không tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }
    const objectUpdate = {};
    if (username) {
      objectUpdate.username = username;
    }
    if (address) {
      objectUpdate.address = address;
    }
    if (email) {
      objectUpdate.email = email;
    }
    if (phone) {
      objectUpdate.phone = phone;
    }
    if (username) {
      objectUpdate.username = username;
    }
    if (status) {
      objectUpdate.status = status;
    }

    const data = db.Customer.update(objectUpdate, {
      where: {
        id: id,
      },
    });

    return {
      EM: "Cập nhật tài khoản thành công",
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

const deleteCustomer = async (rawData) => {
  const { id, table } = rawData;

  try {
    let exitUser = await db[table].findByPk(+id);

    if (!exitUser) {
      return {
        EM: "Tài khoản  không tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }

    if (exitUser.role == "admin") {
      return {
        EM: "Tài khoản admin không được xóa !!!",
        EC: -2,
        DT: [],
      };
    }

    await db[table].destroy({
      where: {
        id: +id,
      },
    });

    return {
      EM: "Xóa tài khoản thành công !!!",
      EC: 0,
      DT: [],
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

export default {
  deleteCustomer,
  readAllCustomer,
  updateCustomer,
  readCustomer,
};

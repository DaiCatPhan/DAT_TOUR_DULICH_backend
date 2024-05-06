import { Op } from "sequelize";
import db from "../app/models";

const readAllCustomer = async (rawData) => {
  const { role, phone, email, username, page, limit, status } = rawData;

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

    if (status) {
      whereCondition.status = status;
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
      raw: true,
      nest: true,
      where: whereCondition,
      limit: limit ? parseInt(limit) : undefined,
      offset: limit && page ? parseInt(offset) : undefined,
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["createdAt", "updatedAt", "refresh_token", "password"],
      },
    };

    const { count, rows } = await db.Customer.findAndCountAll(options);

    // TÍNH SỐ LƯỢT ĐẶT TOUR

    const result = rows.map(async (item) => {
      const booking = await db.BookingTour.findAndCountAll({
        raw: true,
        nest: true,
        where: {
          ID_Customer: item.id,
          status: "ĐÃ DUYỆT",
          payment_status: "ĐÃ THANH TOÁN",
        },
        include: [
          { model: db.Voucher },
          { model: db.Calendar, include: { model: db.Tour } },
        ],
      });

      const review = await db.Comment.findAndCountAll({
        raw: true,
        nest: true,
        where: {
          ID_Customer: item.id,
          show: "1",
        },
        include: [{ model: db.Tour }],
      });

      return {
        ...item,
        bookingAr: booking,
        reviewAr: review,
        booking: booking.count,
        review: review.count,
      };
    });

    const resultPromise = await Promise.all(result);

    let data = {
      totalRows: count,
      users: resultPromise,
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
  const { id, nameVoucher } = rawData;

  try {
    const whereCondition = {};
    const whereConditionVoucher = {};

    if (id) {
      whereCondition.id = id;
    }

    if (nameVoucher) {
      whereConditionVoucher.nameVoucher = { [Op.like]: `%${nameVoucher}%` };
    }

    const options = {
      raw: true,
      nest: true,
      where: whereCondition,
      attributes: {
        exclude: ["createdAt", "updatedAt", "refresh_token", "password"],
      },
    };

    const data = await db.Customer.findOne(options);

    const voucherUsers = await db.VoucherUser.findAll({
      where: {
        ID_Customer: data.id,
        status: "0",
      },
      include: [{ model: db.Voucher, where: whereConditionVoucher }],
    });

    data.VoucherUsers = voucherUsers;

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
    if (customer.role === "admin") {
      return {
        EM: "Tài khoản admin không được cập nhật !!!",
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

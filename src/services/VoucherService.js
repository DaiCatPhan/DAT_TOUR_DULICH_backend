import { Op } from "sequelize";
import db from "../app/models";
import moment from "moment";

// ==================== VOUCHER =====================
const create_Voucher = async (rawData) => {
  const {
    typeVoucher,
    value,
    fromDate,
    toDate,
    remainAmount,
    amount,
    nameVoucher,
  } = rawData;

  // Kiểm tra startDay phải lớn hơn hoặc bằng ngày hiện tại

  const startDateTime = new Date(fromDate);
  const endDateTime = new Date(toDate);

  const currentDateTime = new Date();

  if (startDateTime < currentDateTime) {
    return {
      EM: "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại",
      EC: -3,
      DT: [],
    };
  }

  // Kiểm tra endDay phải lớn hơn hoặc bằng ngày startDay
  if (endDateTime < startDateTime) {
    return {
      EM: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
      EC: -3,
      DT: [],
    };
  }

  try {
    const data = await db.Voucher.create({
      typeVoucher: typeVoucher,
      value: value,
      fromDate: startDateTime,
      toDate: endDateTime,
      amount: amount,
      remainAmount: amount,
      nameVoucher: nameVoucher,
    });

    return {
      EM: "Tạo  voucher thành công ",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};
const readAll_Voucher = async (rawData) => {
  const {
    typeVoucher,
    nameVoucher,
    fromDate,
    page,
    limit,
    expired,
    sortCreatedAt,
  } = rawData;

  try {
    const offset = (page - 1) * limit;
    const whereCondition = {};

    if (typeVoucher) {
      whereCondition.typeVoucher = { [Op.like]: `%${typeVoucher}%` };
    }
    if (nameVoucher) {
      whereCondition.nameVoucher = { [Op.like]: `%${nameVoucher}%` };
    }

    if (fromDate) {
      whereCondition.fromDate = {
        [Op.between]: [
          new Date(fromDate),
          new Date(new Date(fromDate).setHours(23, 59, 59)),
        ],
      };
    }

    if (expired == "true") {
      whereCondition.toDate = {
        [Op.gte]: new Date(),
      };
    }

    if (expired == "false") {
      whereCondition.toDate = {
        [Op.lt]: new Date(),
      };
    }

    const options = {
      raw: true,
      nest: true,
      where: whereCondition,
      limit: limit ? parseInt(limit) : undefined,
      offset: limit && page ? parseInt(offset) : undefined,
    };

    const { count, rows } = await db.Voucher.findAndCountAll(options);
    let data = {
      totalRows: count,
      vouchers: rows,
    };

    const dataResult = data?.vouchers?.map(async (voucher) => {
      const voucherSaved = await db.VoucherUser.findAndCountAll({
        where: {
          ID_Voucher: voucher.id,
        },
      });
      const voucherRemaining = +voucher.amount - +voucherSaved.count;
      return {
        ...voucher,
        voucherRemaining: voucherRemaining,
      };
    });

    const dataResultPromise = await Promise.all(dataResult);

    return {
      EM: "Lấy dữ liệu thành công ",
      EC: 0,
      DT: {
        totalRows: data?.totalRows,
        vouchers: dataResultPromise,
      },
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
const update_Voucher = async (rawData) => {
  const { id, typeVoucher, value, fromDate, toDate, amount, nameVoucher } =
    rawData;

  const exitVoucher = await db.Voucher.findByPk(id);
  if (!exitVoucher) {
    return {
      EM: "Voucher không tồn tại !!!!",
      EC: -2,
      DT: [],
    };
  }

  const condition = {};
  if (typeVoucher) {
    condition.typeVoucher = typeVoucher;
  }
  if (value) {
    condition.value = value;
  }
  if (amount) {
    condition.amount = amount;
  }

  if (fromDate) {
    condition.fromDate = fromDate;
  }
  if (toDate) {
    condition.toDate = toDate;
  }
  if (nameVoucher) {
    condition.nameVoucher = nameVoucher;
  }

  try {
    const data = await db.Voucher.update(condition, {
      where: {
        id: id,
      },
    });

    return {
      EM: "Cập nhật kiểu voucher thành công ",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

//================== VOUCHER USER ======================
const create_VoucherUser = async (rawData) => {
  const { ID_Voucher, ID_Customer, status } = rawData;

  try {
    const exitVoucher = await db.Voucher.findByPk(+ID_Voucher);
    if (!exitVoucher) {
      return {
        EM: "Voucher không tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }

    // XEM NÓ CÒN SLOT K
    const voucherSaved = await db.VoucherUser.findAndCountAll({
      where: {
        ID_Voucher: ID_Voucher,
      },
    });
    const voucherRemaining = +exitVoucher.amount - +voucherSaved.count;
    if (voucherRemaining < 1) {
      return {
        EM: "Voucher đã hết slot !!!",
        EC: -2,
        DT: [],
      };
    }

    const exitUser = await db.Customer.findByPk(+ID_Customer);
    if (!exitUser) {
      return {
        EM: "Tài khoản khách hàng không tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }
    const exitVoucherUser = await db.VoucherUser.findOne({
      where: {
        ID_Voucher: ID_Voucher,
        ID_Customer: ID_Customer,
      },
    });
    if (exitVoucherUser) {
      return {
        EM: "Đã lưu voucher trong kho !!!",
        EC: -2,
        DT: [],
      };
    }

    const data = await db.VoucherUser.create({
      ID_Voucher: ID_Voucher,
      ID_Customer: ID_Customer,
      status: status,
    });

    return {
      EM: "Tạo  voucher cho khách hàng thành công ",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

const read_VoucherUser = async (rawData) => {
  const { id } = rawData;

  try {
    const data = await db.VoucherUser.findAll({
      where: {
        ID_Customer: id,
      },
      include: [
        { model: db.Voucher },
        {
          model: db.Customer,
          attributes: {
            exclude: ["createdAt", "updatedAt", "refresh_token", "password"],
          },
        },
      ],
      raw: true,
      nest: true,
    });

    const dataFilter = data.filter((item) => {
      const currentDay = new Date();
      const endDayVoucher = new Date(item.Voucher.toDate);

      console.log("currentDay", currentDay);
      console.log("endDayVoucher", endDayVoucher);
      console.log("a", currentDay > endDayVoucher);

      return currentDay < endDayVoucher;
    });

    return {
      EM: "Lấy voucher cho khách hàng thành công ",
      EC: 0,
      DT: dataFilter,
    };
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

export default {
  create_Voucher,
  readAll_Voucher,
  update_Voucher,
  create_VoucherUser,
  read_VoucherUser,
};

import db from "../app/models";

// ==================== VOUCHER =====================
const create_Voucher = async (rawData) => {
  const { typeVoucher, value, fromDate, toDate, amount, nameVoucher } = rawData;

  try {
    const exitTypeVoucher = await db.Voucher.findOne({
      where: {
        nameVoucher: nameVoucher,
      },
    });
    if (exitTypeVoucher) {
      return {
        EM: "Tên voucher đã tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }

    const data = await db.Voucher.create({
      typeVoucher: typeVoucher,
      value: value,
      fromDate: fromDate,
      toDate: toDate,
      amount: amount,
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
  const { typeVoucher, nameVoucher, fromDate, page, limit } = rawData;

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

    const { count, rows } = await db.Voucher.findAndCountAll(options);
    let data = {
      totalRows: count,
      vouchers: rows,
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
      include: [{ model: db.Voucher }, { model: db.Customer }],
    });

    if (!data) {
      return {
        EM: "Không tồn tại voucher user !!!",
        EC: -2,
        DT: [],
      };
    }

    return {
      EM: "Lấy voucher cho khách hàng thành công ",
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

export default {
  create_Voucher,
  readAll_Voucher,
  update_Voucher,
  create_VoucherUser,
  read_VoucherUser,
};

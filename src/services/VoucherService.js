import db from "../app/models";

// TYPE VOUCHER
const create_TypeVoucher = async (rawData) => {
  const { typeVoucher, value, maxValue, minValue } = rawData;

  try {
    const data = await db.TypeVoucher.create({
      typeVoucher: typeVoucher,
      value: value,
      maxValue: maxValue,
      minValue: minValue,
    });

    return {
      EM: "Tạo kiểu voucher thành công ",
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

// VOUCHER
const create_Voucher = async (rawData) => {
  const { ID_Typevoucher, fromDate, toDate, amount, codeVoucher } = rawData;

  try {
    const exitTypeVoucher = await db.TypeVoucher.findByPk(ID_Typevoucher);
    if (!exitTypeVoucher) {
      return {
        EM: "Kiểu voucher không tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }

    const data = await db.Voucher.create({
      ID_Typevoucher: ID_Typevoucher,
      fromDate: fromDate,
      toDate: toDate,
      amount: amount,
      codeVoucher: codeVoucher,
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

// VOUCHER USER
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
      include: [{ model: db.Voucher  }, { model: db.Customer }],
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
  create_TypeVoucher,
  create_Voucher,
  create_VoucherUser,
  read_VoucherUser,
};

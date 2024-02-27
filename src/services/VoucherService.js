import db from "../app/models";

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

export default { create_TypeVoucher, create_Voucher };

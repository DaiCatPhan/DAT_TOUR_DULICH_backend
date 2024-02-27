import db from "../app/models";
const { Op } = require("sequelize");

const createCategory = async (rawData) => {
  const { type, value } = rawData;

  try {
    const exit = await db.Category.findOne({
      where: {
        type: type,
        value: value,
      },
    });

    if (exit) {
      return {
        EM: "Doanh mục đã tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }

    const data = await db.Category.create({
      type: type,
      value: value,
    });

    return {
      EM: "Tạo doanh mục thành công ",
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

const readAllCategory = async (rawData) => {
  const { type, value, page, limit } = rawData;
  try {
    const offset = (page - 1) * limit;
    const whereCondition = {};

    if (type) {
      whereCondition.type = { [Op.like]: `%${type}%` };
    }
    if (value) {
      whereCondition.value = { [Op.like]: `%${value}%` };
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

    const { count, rows } = await db.Category.findAndCountAll(options);
    let data = {
      totalRows: count,
      categoris: rows,
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

export default { createCategory, readAllCategory };

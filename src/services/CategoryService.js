import db from "../app/models";

const createCategory = async (rawData) => {
  const { type, value } = rawData;

  try {
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
  const { page, limit } = rawData;
  try {
    const offset = (page - 1) * limit;
    const whereCondition = {};

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
      tours: rows,
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

import db from "../app/models";
const { Op } = require("sequelize");

const create = async (rawData) => {
  const { ID_Customer, title, contentHTML, contentTEXT, status } = rawData;

  try {
    const data = await db.Blog.create({
      ID_Customer: ID_Customer,
      title: title,
      image: image,
      contentTEXT: contentTEXT,
      contentHTML: contentHTML,
      status: status,
    });

    return {
      EM: "Tạo thông báo thành công ",
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
export default { create };

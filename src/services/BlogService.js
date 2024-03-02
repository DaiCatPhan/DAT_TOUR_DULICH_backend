import { raw } from "express";
import db from "../app/models";
const { Op } = require("sequelize");

const createBlog = async (rawData) => {
  const { title, shortdescription, image, contentTEXT, contentHTML } = rawData;

  try {
    const data = await db.Blog.create({
      title: title,
      shortdescription: shortdescription,
      image: image,
      contentTEXT: contentTEXT,
      contentHTML: contentHTML,
    });

    return {
      EM: "Tạo bài viết thành công ",
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

const updateBlog = async (rawData) => {
  const { id, title, shortdescription, image, contentTEXT, contentHTML } =
    rawData;

  const exitBlog = await db.Blog.findByPk(id);
  if (!exitBlog) {
    return {
      EM: "Bài viết không tồn tại !!!!",
      EC: -2,
      DT: [],
    };
  }

  const condition = {};
  if (title) {
    condition.title = title;
  }
  if (shortdescription) {
    condition.shortdescription = shortdescription;
  }
  if (image) {
    condition.image = image;
  }
  if (contentTEXT) {
    condition.contentTEXT = contentTEXT;
  }
  if (contentHTML) {
    condition.contentHTML = contentHTML;
  }

  try {
    const data = await db.Blog.update(condition, {
      where: {
        id: id,
      },
    });

    return {
      EM: "Cập nhật bài viết thành công ",
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

const readBlog = async (rawData) => {
  const { id } = rawData;
  try {
    const exitBlog = await db.Blog.findByPk(+id);
    if (!exitBlog) {
      return {
        EM: "Bài viết không tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }

    const data = await db.Blog.findOne({
      where: {
        id: id,
      },
    });

    return {
      EM: "Lấy bài viết thành công",
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

const readAllBlog = async (rawData) => {
  const { createdAt, title, page, limit } = rawData;
  console.log(rawData);
  try {
    const offset = (page - 1) * limit;
    const whereCondition = {};

    if (title) {
      whereCondition.title = { [Op.like]: `%${title}%` };
    }
    if (createdAt) {
      whereCondition.createdAt = {
        [Op.between]: [
          new Date(createdAt),
          new Date(new Date(createdAt).setHours(23, 59, 59)),
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

    const { count, rows } = await db.Blog.findAndCountAll(options);
    let data = {
      totalRows: count,
      blogs: rows,
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

export default { createBlog, updateBlog, readBlog, readAllBlog };

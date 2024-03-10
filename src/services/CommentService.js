import { raw } from "express";
import db from "../app/models";
const { Op } = require("sequelize");

const createComment = async (rawData) => {
  const { ID_Customer, ID_Blog, ID_Tour, parentID, content, star, status } =
    rawData;

  try {
    const condition = {};
    if (ID_Customer) {
      condition.ID_Customer = ID_Customer;
    }
    if (ID_Blog) {
      condition.ID_Blog = ID_Blog;
    }
    if (ID_Tour) {
      condition.ID_Tour = ID_Tour;
    }
    if (parentID) {
      condition.parentID = parentID;
    }
    if (content) {
      condition.content = content;
    }
    if (star) {
      condition.star = star;
    }
    condition.status = "0";

    const data = await db.Comment.create(condition);

    return {
      EM: "Tạo comment thành công ",
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

const updateComment = async (rawData) => {
  const { id, ID_Customer, ID_Blog, ID_Tour, parentID, content, star, status } =
    rawData;

  try {
    const condition = {};
    if (ID_Customer) {
      condition.ID_Customer = ID_Customer;
    }
    if (ID_Blog) {
      condition.ID_Blog = ID_Blog;
    }
    if (ID_Tour) {
      condition.ID_Tour = ID_Tour;
    }
    if (parentID) {
      condition.parentID = parentID;
    }
    if (content) {
      condition.content = content;
    }
    if (star) {
      condition.star = star;
    }
    if (status) {
      condition.status = status;
    }

    const data = await db.Comment.update(condition, {
      where: {
        id: id,
      },
    });

    return {
      EM: "Cập nhật comment thành công ",
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

const getAllCommentsRecursive = async (parentId) => {
  const childComments = await db.Comment.findAll({
    where: { parentId },
    raw: true,
  });

  for (let i = 0; i < childComments.length; i++) {
    childComments[i].childComment = await getAllCommentsRecursive(
      childComments[i].id
    );
    childComments[i].customer = await db.Customer.findByPk(
      childComments[i].ID_Customer,
      {
        attributes: ["username"],
      }
    );
  }

  return childComments;
};

const getAllCommentByBlogId = async (rawData) => {
  const { id, status } = rawData;
  try {
    const condition = {};
    condition.ID_BLog = id;
    condition.parentID = null;
    if (status) {
      condition.status = status;
    }

    const topLevelComments = await db.Comment.findAll({
      where: condition,
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    for (let i = 0; i < topLevelComments.length; i++) {
      topLevelComments[i].childComment = await getAllCommentsRecursive(
        topLevelComments[i].id
      );
      topLevelComments[i].customer = await db.Customer.findByPk(
        topLevelComments[i].ID_Customer,
        {
          attributes: ["username"],
        }
      );
    }

    return {
      EC: 0,
      EM: "Lấy comment thành công",
      DT: topLevelComments,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

export default {
  updateComment,
  createComment,
  getAllCommentByBlogId,
};

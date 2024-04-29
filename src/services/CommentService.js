import { raw } from "express";
import db from "../app/models";
const { Op } = require("sequelize");

const createComment = async (rawData) => {
  const { ID_Customer, ID_Blog, ID_Tour, parentID, content, star } = rawData;

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
    condition.show = "1";

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

const readCommentTour = async (rawData) => {
  const { ID_Customer, ID_Blog, ID_Tour, parentID, content, star, show } =
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
    if (show) {
      condition.show = show;
    }

    const data = await db.Comment.findAll(condition, {
      where: {
        id: ID_Tour,
      },
    });

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

const review = async (rawData) => {
  const { ID_Customer, ID_Blog, ID_Tour, parentID, content, star, show } =
    rawData;

  try {
    const tour = await db.Tour.findAll({
      raw: true,
      nest: true,
      where: {
        id: ID_Tour,
      },
    });

    const tourComment = tour.map(async (item) => {
      const commentTour = await db.Comment.findAll({
        raw: true,
        nest: true,
        where: {
          ID_Tour: item.id,
        },
      });
      return {
        ...item,
        commentTour: commentTour,
      };
    });

    const tourCommentPromise = await Promise.all(tourComment);

    const TourtotalNumberReView = tourCommentPromise.map((item) => {
      const totalNumberOfStars = item.commentTour.reduce((total, value) => {
        return (total += value.star);
      }, 0);
      const averageNumberOfStars = totalNumberOfStars / item.commentTour.length;

      const numberReview5Star = item.commentTour.reduce((total, item) => {
        if (item.star == 5) {
          return (total += 1);
        }
        return total;
      }, 0);

      const numberReview4Star = item.commentTour.reduce((total, item) => {
        if (item.star == 4) {
          return (total += 1);
        }
        return total;
      }, 0);

      const numberReview3Star = item.commentTour.reduce((total, item) => {
        if (item.star == 3) {
          return (total += 1);
        }
        return total;
      }, 0);

      const numberReview2Star = item.commentTour.reduce((total, item) => {
        if (item.star == 2) {
          return (total += 1);
        }
        return total;
      }, 0);

      const numberReview1Star = item.commentTour.reduce((total, item) => {
        if (item.star == 1) {
          return (total += 1);
        }
        return total;
      }, 0);

      return {
        ...item,
        review: {
          totalNumberReView: item.commentTour.length,
          averageNumberOfStars: averageNumberOfStars,
          numberReview5Star: numberReview5Star,
          numberReview4Star: numberReview4Star,
          numberReview3Star: numberReview3Star,
          numberReview2Star: numberReview2Star,
          numberReview1Star: numberReview1Star,
        },
      };
    });

    return {
      EM: "Tạo comment thành công ",
      EC: 0,
      DT: TourtotalNumberReView,
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
  updateComment,
  createComment,
  getAllCommentByBlogId,
  readCommentTour,
  review,
};

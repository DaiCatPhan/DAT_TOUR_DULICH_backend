import { raw } from "express";
import db from "../app/models";
const { Op, where } = require("sequelize");

const create = async (rawData) => {
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

const update = async (rawData) => {
  const { id, ID_Customer, ID_Blog, ID_Tour, parentID, content, star, show } =
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

const readAll = async (rawData) => {
  const { ID_Tour, star, show, nameTour, createdAt, sortcreatedAt, sortOrder } =
    rawData;
  try {
    const condition = {};
    const conditionSort = {};
    const conditionTour = {};

    if (ID_Tour) {
      condition.ID_Tour = ID_Tour;
    }

    if (createdAt) {
      const startOfDay = new Date(createdAt);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(createdAt);
      endOfDay.setHours(23, 59, 59, 999);

      condition.createdAt = {
        [Op.between]: [startOfDay, endOfDay],
      };
    }

    function removeAccentsAndLowerCase(str) {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }

    if (nameTour) {
      const wordsToSearch = removeAccentsAndLowerCase(nameTour)
        .split(/\s+/)
        .filter(Boolean);
      const wordConditions = wordsToSearch.map((word) => ({
        [Op.like]: `%${word}%`,
      }));

      conditionTour.name = { [Op.and]: wordConditions };
    }

    if (show) {
      condition.show = show;
    }

    if (star) {
      condition.star = star;
    }

    if (sortcreatedAt && sortOrder) {
      conditionSort.sort = [["createdAt", sortOrder]];
    }

    const data = await db.Comment.findAll({
      raw: true,
      nest: true,
      where: condition,
      order: conditionSort.sort,
      include: [
        {
          model: db.Customer,
          attributes: {
            exclude: ["createdAt", "updatedAt", "refresh_token", "password"],
          },
        },
        {
          model: db.Tour,
          where: conditionTour,
        },
      ],
    });

    return {
      EC: 0,
      EM: "Lấy comment thành công",
      DT: data,
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
    let condition = {};
    if (ID_Tour) {
      condition.ID_Tour = ID_Tour;
    }

    if (show) {
      condition.show = show;
    }

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
        where: condition,
        include: [
          {
            model: db.Customer,
            attributes: {
              exclude: ["createdAt", "updatedAt", "refresh_token", "password"],
            },
          },
        ],
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
  update,
  create,
  readAll,
  review,
};

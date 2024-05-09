import db from "../app/models";
const { Op, where } = require("sequelize");

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

const read = async (rawData) => {
  const { ID_Customer, read, sortcreatedAt } = rawData;

  try {
    const condition = {
      read: { [Op.in]: ["1", "0"] },
    };
    const conditionSort = {};
    if (ID_Customer) {
      condition.ID_Customer = ID_Customer;
    }
    if (sortcreatedAt) {
      conditionSort.order = [["createdAt", sortcreatedAt]];
    }
    if (read) {
      condition.read = read;
    }

    const data = await db.Notification.findAndCountAll({
      raw: true,
      nest: true,
      where: condition,
      ...conditionSort,
    });

    const countNoRead = data.rows.reduce((total, item) => {
      return (total += item.read == "0");
    }, 0);

    data.countNoRead = countNoRead;

    return {
      EM: "Lấy thông báo thành công ",
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

const readID = async (rawData) => {
  const { ID_Notification } = rawData;

  try {
    const data = await db.Notification.findOne({
      raw: true,
      nest: true,
      where: {
        id: ID_Notification,
      },
      include: [
        {
          raw: true,
          nest: true,
          model: db.BookingTour,
          include: {
            raw: true,
            nest: true,
            model: db.Calendar,
            include: { raw: true, nest: true, model: db.Tour },
          },
        },
      ],
    });

    const calendarReplace = await db.Calendar.findAll({
      where: {
        ID_Tour: data?.BookingTour?.Calendar?.ID_Tour,
        startDay: { [Op.gt]: data?.BookingTour?.Calendar?.startDay },
      },
    });

    data.calendarReplace = calendarReplace;

    return {
      EM: "Lấy thông báo thành công ",
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
  try {
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

const update = async (rawData) => {
  const { ID_Notification, read, title, contentHTML, contentTEXT } = rawData;

  try {
    const condition = {}; 
    if (read) {
      condition.read = read;
    }
    if (title) {
      condition.title = title;
    }
    if (contentHTML) {
      condition.contentHTML = contentHTML;
    }
    if (contentTEXT) {
      condition.contentTEXT = contentTEXT;
    }
    const data = await db.Notification.update(condition, {
      where: {
        id: ID_Notification,
      },
    });

    return {
      EM: "Update thông báo thành công ",
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
export default { create, read, readAll, readID, update };

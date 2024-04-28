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
    const condition = {};
    if (ID_Customer) {
      condition.ID_Customer = ID_Customer;
    }
    if (sortcreatedAt) {
      condition.sort = ["createdAt", sortcreatedAt];
    }
    if (read) {
      condition.read = read;
    }

    const data = await db.Notification.findAndCountAll({
      raw: true,
      nest: true,
      where: condition,
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
      where: {
        id: ID_Notification,
      },
      include: [{ model: db.Calendar, include: { model: db.Tour } }],
    });

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

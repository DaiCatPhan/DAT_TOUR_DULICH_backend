import db from "../app/models";
const { Op } = require("sequelize");

const createRoom = async (rawData) => {
  try {
    const { userOne } = rawData;

    let room = await db.RoomMessage.findOne({
      where: { userOne: userOne },
      raw: true,
    });

    if (room) {
      return {
        EM: "Phòng chát đã được tạo",
        EC: -2,
        DT: room,
      };
    }

    const userAdminChat = await db.Customer.findOne({
      where: { email: "admin@gmail.com" },
      raw: true,
    });

    if (!userAdminChat) {
      return {
        EM: "admin chat không tồn tại",
        EC: -2,
        DT: [],
      };
    }

    const data = await db.RoomMessage.create(
      {
        userOne: userOne,
        userTwo: userAdminChat?.id,
      },
      {
        raw: true,
      }
    );

    const dataResult = data.get({ plain: true });

    return {
      EM: "Tạo phòng chát thành công",
      EC: 0,
      DT: dataResult,
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

const create = async (rawData) => {
  try {
    const { ID_User, ID_Room, unRead, text } = rawData;

    const exitRoom = await db.RoomMessage.findByPk(ID_Room, { raw: true });
    if (!exitRoom) {
      return {
        EM: "Phòng chát không tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }
    const data = await db.Message.create({
      ID_User: ID_User,
      ID_Room: ID_Room,
      text: text,
      read: 0,
    });

    const dataResult = data.get({ plain: true });
    dataResult.exitRoom = exitRoom;

    return {
      EM: "Gửi tin nhắn  thành công",
      EC: 0,
      DT: dataResult,
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
  try {
    const { ID_User, ID_Room, read, text } = rawData;

    const data = await db.Message.update(
      {
        read: 1,
      },
      {
        where: {
          ID_Room: ID_Room,
          ID_User: ID_User,
        },
      }
    );

    return {
      EM: "Cập nhật trạng thái tin nhắn thành công",
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

const listRoomOfUser = async (rawData) => {
  try {
    const { userOne } = rawData;

    let room = await db.RoomMessage.findAll({
      where: { userOne: userOne },
      raw: true,
    });

    // tất cả tin nhắn của phòng chat
    for (let i = 0; i < room.length; i++) {
      room[i].messageData = await db.Message.findAll({
        raw: true,
        nest: true,
        where: { ID_Room: room[i].id },
        include: [
          {
            model: db.Customer,
            attributes: {
              exclude: [
                "password",
                "refresh_token",
                "address",
                "status",
                "createdAt",
                "updatedAt",
              ],
            },
          },
        ],
      });
    }

    const unread = room[0].messageData.some((item) => {
      return item.Customer.email == "admin@gmail.com" && item.read == 0;
    });

    if (unread) {
      room[0].count = 1;
    } else {
      room[0].count = 0;
    }

    return {
      EM: "Danh sách tin nhắn phòng chát",
      EC: 0,
      DT: room,
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

const listRoomOfAdmin = async (rawData) => {
  try {
    let user = await db.Customer.findOne({
      where: { email: "admin@gmail.com" },
    });
    if (!user) {
      return {
        EM: "Admin chát không tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }

    let room = await db.RoomMessage.findAll({
      raw: true,
      nest: true,
      where: { userTwo: user.id },
      raw: true,
    });

    for (let i = 0; i < room.length; i++) {
      room[i].messageData = await db.Message.findAll({
        raw: true,
        nest: true,
        where: { ID_Room: room[i].id },
      });

      room[i].userOneData = await db.Customer.findOne({
        raw: true,
        nest: true,
        where: {
          id: room[i].userOne,
        },
        attributes: {
          exclude: [
            "password",
            "refresh_token",
            "address",
            "status",
            "createdAt",
            "updatedAt",
          ],
        },
      });
    }

    const roomFilter = room?.filter((item) => {
      return item.messageData.length > 0;
    });

    const roomResult = roomFilter.map((item) => {
      const count = item?.messageData?.reduce((total, mes) => {
        if (mes.ID_User != user?.id && mes.read == 0) {
          return total + 1;
        }
        return total;
      }, 0);

      return {
        ...item,
        count: count,
      };
    });

    return {
      EM: "Danh sách tin nhắn phòng chát",
      EC: 0,
      DT: roomResult,
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
  create,
  createRoom,
  listRoomOfUser,
  listRoomOfAdmin,
  update,
};

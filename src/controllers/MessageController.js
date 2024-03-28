import MessageService from "../services/MessageService";

class Message {
  // [POST] /api/v1/message/createRoom
  async createRoom(req, res) {
    const { userOne } = req.body;

    if (!userOne) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await MessageService.createRoom(req.body);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server", // error message
        EC: -5, // error code
        DT: [], // data
      });
    }
  }

  // [POST] /api/v1/message/create
  async create(req, res) {
    const { ID_User, ID_Room, unRead, text } = req.body;

    if (!ID_User || !ID_Room || !text) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await MessageService.create(req.body);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server", // error message
        EC: -5, // error code
        DT: [], // data
      });
    }
  }

  // [GET] /api/v1/message/listRoomOfUser
  async listRoomOfUser(req, res) {
    const { userOne } = req.query;

    if (!userOne) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await MessageService.listRoomOfUser(req.query);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server", // error message
        EC: -5, // error code
        DT: [], // data
      });
    }
  }

  // [GET] /api/v1/message/listRoomOfAdmin
  async listRoomOfAdmin(req, res) {
    try {
      const data = await MessageService.listRoomOfAdmin();
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server", // error message
        EC: -5, // error code
        DT: [], // data
      });
    }
  }
}

export default new Message();

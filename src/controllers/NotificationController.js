import NotificationService from "../services/NotificationService";

class Notification {
  // [POST] /api/v1/notification/create
  async create(req, res) {
    const { ID_Customer, title, contentHTML, contentTEXT, status } = req.body;

    if (!userOne) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await NotificationService.create(req.body);
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

  // [POST] /api/v1/notification/read
  async read(req, res) {
    const { ID_Customer, sortcreatedAt , read } = req.query;

    try {
      const data = await NotificationService.read(req.query);
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

  // [POST] /api/v1/notification/readID
  async readID(req, res) {
    const { ID_Notification } = req.query;

    try {
      const data = await NotificationService.readID(req.query);
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

  // [POST] /api/v1/notification/readAll
  async readAll(req, res) {
    const { ID_Customer } = req.query;

    try {
      const data = await NotificationService.read(req.query);
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

  // [PUT] /api/v1/notification/update
  async update(req, res) {
    const { ID_Notification, read, title, contentHTML, contentTEXT } = req.body;
    if (!ID_Notification) {
      return res.status(200).json({
        EM: "Thiếu dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }
    try {
      const data = await NotificationService.update(req.body); 
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

export default new Notification();

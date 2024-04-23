import NotificationService from "../services/NotificationService";

class Notification {
  // [POST] /api/v1/message/createRoom
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
}

export default new Notification();

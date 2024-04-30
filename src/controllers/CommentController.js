import CommentService from "../services/CommentService";

class Comment {
  // [POST] /api/v1/comment/create
  async create(req, res) {
    const { ID_Customer, ID_Blog, ID_Tour, parentID, content, star, status } =
      req.body;

    if (!ID_Customer || (!ID_Blog && !ID_Tour) || !content) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await CommentService.create(req.body);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server",
        EC: -5,
        DT: [],
      });
    }
  }

  // [PUT] /api/v1/comment/update
  async update(req, res) {
    const { id, ID_Customer, ID_Blog, ID_Tour, parentID, content, star, show } =
      req.body;

    if (!id) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await CommentService.update(req.body);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server",
        EC: -5,
        DT: [],
      });
    }
  }

  // [GET] /api/v1/comment/readAll
  async readAll(req, res) {
    const {
      ID_Tour,
      show,
      nameTour,
      createdAt,
      star,
      sortcreatedAt,
      sortOrder,
    } = req.query;

    try {
      const data = await CommentService.readAll(req.query); 
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server",
        EC: -5,
        DT: [],
      });
    }
  }

  // [POST] /api/v1/comment/review
  async review(req, res) {
    const { ID_Customer, ID_Blog, ID_Tour, parentID, content, star, show } =
      req.query;

    try {
      const data = await CommentService.review(req.query);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server",
        EC: -5,
        DT: [],
      });
    }
  }
}

export default new Comment();

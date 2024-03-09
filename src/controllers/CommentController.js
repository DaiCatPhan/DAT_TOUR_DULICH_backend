import CommentService from "../services/CommentService";

class Comment {
  // [POST] /api/v1/comment/create
  async createComment(req, res) {
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
      const data = await CommentService.createComment(req.body);
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

  async getAllCommentByBlogId(req, res) {
    const { id , status } = req.query;

    if (!id) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await CommentService.getAllCommentByBlogId(req.query);
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

  async deleteComment(req, res) {
    const { ID_Customer, ID_Blog, ID_Tour, parentID, content, star } = req.body;

    if (
      !ID_Customer ||
      (!ID_Blog && !ID_Tour) ||
      !content ||
      !star ||
      !parentID
    ) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await CommentService.createComment(req.body);
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

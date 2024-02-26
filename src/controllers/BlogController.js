import BlogService from "../services/BlogService";

class Blog {
  // [POST] /api/v1/blog/create
  async create(req, res) {
    const { title, shortdescription, contentTEXT, contentHTML } = req.body;

    let imageUrl = req.file?.path;

    if (
      !title ||
      !shortdescription ||
      !imageUrl ||
      !contentTEXT ||
      !contentHTML
    ) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    const rawData = {
      title,
      shortdescription,
      image: imageUrl,
      contentTEXT,
      contentHTML,
    };

    try {
      const data = await BlogService.createBlog(rawData);
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

  // [PUT] /api/v1/blog/update
  async update(req, res) {
    const { id, title, shortdescription, contentTEXT, contentHTML } = req.body;

    let imageUrl = req.file?.path;

    if (!id) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    const rawData = {
      id,
      title,
      shortdescription,
      image: imageUrl,
      contentTEXT,
      contentHTML,
    };

    try {
      const data = await BlogService.updateBlog(rawData);
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

  // [GET] /api/v1/blog/read
  async read(req, res) {
    const { id } = req.query;

    if (!id) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await BlogService.readBlog(req.query);
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

  // [GET ] /api/v1/blog/readAll
  async readAll(req, res) {
    const { title, page, limit } = req.query;

    try {
      const data = await BlogService.readAllBlog(req.query);
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

export default new Blog();

import CategoryService from "../services/CategoryService";

class Category {
  // [POST] /api/v1/category/create
  async create(req, res) {
    const { type, value } = req.body;

    if (!type || !value) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await CategoryService.createCategory(req.body);
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

  // [GET] /api/v1/category/readAll
  async readAll(req, res) {
    const {type , value ,  limit, page } = req.query;

    try {
      const data = await CategoryService.readAllCategory(req.query);
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

export default new Category();

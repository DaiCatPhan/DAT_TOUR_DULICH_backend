import TourService from "../services/TourService";

class Tour {
  // [POST] /api/v1/tour/create
  async create(req, res) {
    try {
      const {
        name,
        address,
        domain,
        priceAdult,
        priceChild,
        price_Include_TEXT,
        price_Include_HTML,
        price_NotInclude_TEXT,
        price_NotInclude_HTML,
        duration,
        status,
        vehicle,
      } = req.body;

      // Validate
      if (
        !name ||
        !address ||
        !domain ||
        !priceAdult ||
        !priceChild ||
        !price_Include_TEXT ||
        !price_Include_HTML ||
        !price_NotInclude_TEXT ||
        !price_NotInclude_HTML ||
        !duration ||
        !status ||
        !vehicle
      ) {
        return res.status(200).json({
          EM: "Nhập thiếu trường dữ liệu !!!",
          EC: -2,
          DT: [],
        });
      }

      const data = await TourService.createTour(req.body);

      res.status(200).json({
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

  read(req, res) {
    res.json("read Tour");
  }

  update(req, res) {
    res.json("update Tour");
  }
  
  delete(req, res) {
    res.json("delete Tour");
  }

  async search(req, res) {
    try {
      const { name, price, startDate } = req.query;

      // Xây dựng điều kiện tìm kiếm
      const whereCondition = {};
      if (name) whereCondition.name = { [Op.like]: `%${name}%` };
      if (price) whereCondition.price = price;
      if (startDate) whereCondition.startDate = startDate;

      // Thực hiện truy vấn
      const tours = await Tour.findAll({ where: whereCondition });

      res.json(tours);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // [PATCH]  /api/v1/tour/uploadImageTour
  async uploadImage(req, res) {
    const { ID_Tour } = req.body;
    let image = req.file?.path;

    if (!image || !ID_Tour) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await TourService.UpImageTour({ ID_Tour, image });

      res.status(200).json({
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

export default new Tour();

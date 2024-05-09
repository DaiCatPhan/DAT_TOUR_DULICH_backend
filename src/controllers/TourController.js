import TourService from "../services/TourService";

class Tour {
  // [POST] /api/v1/tour/create
  async create(req, res) {
    try {
      const {
        name,
        type,
        priceAdult,
        priceChild,
        numbeOfDay,
        numberOfNight,
        status,
        vehicle,
      } = req.body;

      // Validate
      if (
        !name ||
        !type ||
        !priceAdult ||
        !priceChild ||
        !numbeOfDay ||
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

  // [GET] /api/v1/tour/read
  async read(req, res) {
    try {
      const {
        id,
        statusCalendar,
        sortStartDayCalendar,
        numberCalenadar,
        getAll,
      } = req.query;

      if (!id) {
        return res.status(200).json({
          EM: "Nhập thiếu trường dữ liệu !!!",
          EC: -2,
          DT: [],
        });
      }

      const data = await TourService.getTourDetailById(req.query);

      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server", // error message
        EC: "-1", // error code
        DT: "", // data
      });
    }
  }

  // [GET] /api/v1/tour/readAll
  async readAll(req, res) {
    try {
      const {
        id,
        name,
        page,
        limit,
        type,
        priceStart, 
        priceEnd,
        startDay,
        startDayEnd,
        status,
        sortByStar,
        sortBooking,
        sortBycreatedAt,
        sortByPrice,
        sortByStartDate,
        sortByDuration,
        sortOrder,
      } = req.query;

      // let data = await TourService.getTourWithPagination(req.query);
      let data = await TourService.getToursFilter(req.query);
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

  // [GET] /api/v1/tour/readAll
  async readAllMostPopular(req, res) {
    try {
      const { page, limit, sortBooking, sortOrder, status } = req.query;

      let data = await TourService.readAllMostPopular(req.query);
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

  // [POST] /api/v1/tour/update
  async update(req, res) {
    try {
      const {
        id,
        name,
        type,
        priceAdult,
        priceChild,
        numberOfNight,
        numbeOfDay,
        status,
        vehicle,
      } = req.body;

      // Validate
      if (
        !id ||
        !name ||
        !type ||
        !priceAdult ||
        !priceChild ||
        !numbeOfDay ||
        !status ||
        !vehicle
      ) {
        return res.status(200).json({
          EM: "Nhập thiếu trường dữ liệu !!!",
          EC: -2,
          DT: [],
        });
      }

      const data = await TourService.updateTour(req.body);

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

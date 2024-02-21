import ViewedToursService from "../services/ViewedToursService";

class Destination {
  // [POST] /api/v1/viewed/create
  async createViewedTour(req, res) {
    const { ID_Customer, ID_Tour } = req.body;

    if (!ID_Customer || !ID_Tour) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await ViewedToursService.createViewedTour(req.body);
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

  // [GET] /api/v1/viewed/reads
  async readsViewedTour(req, res) {
    try {
      const { ID_Customer } = req.query;

      if (!ID_Customer ) {
        return res.status(200).json({
          EM: "Nhập thiếu trường dữ liệu !!!",
          EC: -2,
          DT: [],
        });
      }

      const data = await ViewedToursService.readsViewed(req.query);

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
}

export default new Destination();

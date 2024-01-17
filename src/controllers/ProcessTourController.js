import ProcessTourService from "../services/ProcessTourService";

class ProcessTour {
  // [POST] /api/v1/process/create
  async create(req, res) {
    const { ID_Tour, descriptionHTML, descriptionTEXT } = req.body;

    if (!ID_Tour || !descriptionHTML || !descriptionTEXT) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await ProcessTourService.createProcessTour(req.body);
      return res.status(200).json({
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

  // [PUT] /api/v1/process/update
  async update(req, res) {
    const { ID_Tour, idProcessTour, descriptionHTML, descriptionTEXT } =
      req.body;

    if (!ID_Tour || !idProcessTour || !descriptionHTML || !descriptionTEXT) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await ProcessTourService.updateProcessTour(req.body);
      return res.status(200).json({
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

  // [POST] /api/v1/process/create
  async createDestination(req, res) {
    const { ID_ProcessTour, name } = req.body;

    if (!ID_ProcessTour || !name) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await ProcessTourService.createDestinationTour(req.body);
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

export default new ProcessTour();

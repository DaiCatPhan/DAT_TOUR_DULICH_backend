import DestinationService from "../services/DestinationService";

class Destination {
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
      const data = await DestinationService.createDestinationTour(req.body);
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

export default new Destination();

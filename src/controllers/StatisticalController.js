import StatisticalService from "../services/StatisticalService";
class Statistical {
  // [GET] /api/v1/statistical/dashboard

  async dashboard(req, res) {
    try {
      const data = await StatisticalService.dashboard();
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

export default new Statistical();

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
  // [GET] /api/v1/statistical/revenueTour

  async revenueTour(req, res) {
    const { startDay, endDay, month, year, sort } = req.query;
    try {
      const data = await StatisticalService.revenueTour(req.query);
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

  // [GET] /api/v1/statistical/revenueToursMonth

  async revenueToursMonth(req, res) {
    const { startDay, endDay, month, year } = req.query;
    try {
      const data = await StatisticalService.revenueToursMonth(req.query);
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

  // [GET] /api/v1/statistical/revenueToursYear
  async revenueToursYear(req, res) {
    const { startDay, endDay, month, year } = req.query;
    try {
      const data = await StatisticalService.calculateRevenueForRecentYears(
        req.query
      );
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

   // [GET] /api/v1/statistical/revenueToursCancel

   async revenueToursCancel(req, res) {
    const { startDay, endDay, month, year, sort } = req.query;
    try { 
      const data = await StatisticalService.revenueToursCancel(req.query); 
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


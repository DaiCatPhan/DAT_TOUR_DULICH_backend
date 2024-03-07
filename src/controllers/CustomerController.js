import CustomerService from "../services/CustomerService";

class Customer {
  // [GET] /api/v1/customer/readAll
  async readAll(req, res) {
    try {
      const { email, username, page, limit } = req.query;

      let data = await CustomerService.readAllCustomer(req.query);
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

  // [GET] /api/v1/customer/read
  async read(req, res) {
    try {
      const { id } = req.query;

      let data = await CustomerService.readCustomer(req.query); 
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

  // [PUT] /api/v1/customer/update
  async update(req, res) {
    try {
      const { id, username, email, phone, status } = req.body;

      // Validate
      if (
        !id ||
        !name ||
        !type ||
        !priceAdult ||
        !priceChild ||
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
}

export default new Customer();

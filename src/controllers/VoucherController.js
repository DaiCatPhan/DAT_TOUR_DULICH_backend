import VoucherService from "../services/VoucherService";

class Voucher {
  // TYPE VOUCHER
  // [POST] /api/v1/blog/create

  async createTypeVoucher(req, res) {
    const { typeVoucher, value, maxValue, minValue } = req.body;

    if (!typeVoucher || !value || !maxValue || !minValue) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await VoucherService.create_TypeVoucher(req.body);
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
  updateTypeVoucher(req, res) {
    res.json("create");
  }
  
  readAllTypeVoucher(req, res) {
    res.json("create");
  }

  //    VOUCHER
  async createVoucher(req, res) {
    const { ID_Typevoucher, fromDate, toDate, amount, codeVoucher } = req.body;

    if (!ID_Typevoucher || !fromDate || !toDate || !amount || !codeVoucher) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await VoucherService.create_Voucher(req.body);
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
  updateVoucher(req, res) {
    res.json("create");
  }
  readAllVoucher(req, res) {
    res.json("create");
  }

  // VOUCHER_USER
  async createVoucherUser(req, res) {
    const { ID_Voucher, ID_Customer, status } = req.body;

    if (!ID_Voucher || !ID_Customer || !status) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await VoucherService.create_VoucherUser(req.body);
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

  async readVoucherUser(req, res) {
    const { id } = req.query;

    if (!id) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await VoucherService.read_VoucherUser(req.query);
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

export default new Voucher();

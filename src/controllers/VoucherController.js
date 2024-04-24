import VoucherService from "../services/VoucherService";

class Voucher {
  // =================================   VOUCHER  =============================
  async createVoucher(req, res) {
    const {
      typeVoucher,
      value,
      fromDate,
      toDate,
      remainAmount,
      amount,
      nameVoucher,
    } = req.body;

    if (
      !typeVoucher ||
      !value ||
      !fromDate ||
      !toDate ||
      !amount ||
      !nameVoucher
    ) {
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

  // [PUT] /api/v1/voucher/update
  async updateVoucher(req, res) {
    const { id, typeVoucher, value, fromDate, toDate, amount, nameVoucher } =
      req.body;

    if (!id) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await VoucherService.update_Voucher(req.body);
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

  // [GET] /api/v1/voucher/readAll
  async readAllVoucher(req, res) {
    const {
      typeVoucher,
      nameVoucher,
      fromDate,
      page, 
      limit,
      expired,
      sortCreatedAt,
    } = req.query;

    try {
      const data = await VoucherService.readAll_Voucher(req.query);
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

  //================================ VOUCHER_USER ================================
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

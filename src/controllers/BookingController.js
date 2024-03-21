import BookingService from "../services/BookingService";

class Booking {
  // [POST] /api/v1/booking/create
  async create(req, res) {
    const {
      ID_Calendar,
      ID_Customer,
      ID_Voucher,
      numberTicketAdult,
      numberTicketChild,
      total_money,
      remaining_money,
      payment_status,
      payment_method,
      status,
      cancel_booking,
      date_cancel_booking,
      reason_cancel_booking,
    } = req.body;

    console.log("req.body", req.body);

    if (!ID_Calendar || !ID_Customer || !numberTicketAdult || !payment_method) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await BookingService.createBooking(req.body);
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

  // [POST] /api/v1/booking/createCancelBooking
  async createCancelBooking(req, res) {
    const { id, date_cancel_booking, reason_cancel_booking } = req.body;
    if (!id || !date_cancel_booking || !reason_cancel_booking) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await BookingService.createCancelBooking(req.body);
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
  // [POST] /api/v1/booking/update
  async update(req, res) {
    const {
      id,
      ID_Calendar,
      ID_Customer,
      ID_Voucher,
      numberTicketAdult,
      numberTicketChild,
      total_money,
      remaining_money,
      payment_status,
      payment_method,
      status,
      cancel_booking,
      date_cancel_booking,
      reason_cancel_booking,
    } = req.body;

    if (!id) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await BookingService.updateBooking(req.body);
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
  // [POST] /api/v1/booking/read
  async read(req, res) {
    const { ID_Customer, page, limit } = req.query;
    if (!ID_Customer) {
      return res.status(200).json({
        EM: "Thiếu dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await BookingService.readBooking(req.query);
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
  // [POST] /api/v1/booking/readAll
  async readAll(req, res) {
    const { status, page, limit } = req.query;

    try {
      const data = await BookingService.readAllBooking(req.query);
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
}

export default new Booking();

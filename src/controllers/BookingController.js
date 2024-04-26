import BookingService from "../services/BookingService";
let config = require("config");
import moment from "moment";

class Booking {
  // [POST] /api/v1/booking/create
  async create(req, res) {
    const {
      ID_Calendar,
      ID_Customer,
      ID_Voucher,
      numberTicketAdult,
      numberTicketChild,
    } = req.body;

    if (!ID_Calendar || !ID_Customer || !numberTicketAdult) { 
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

  // [POST] /api/v1/booking/updatePaid
  async updatePaid(req, res) {
    const { id, payment_status } = req.body;

    if (!id || !payment_status) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await BookingService.updatePaid(req.body);
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
    const {
      idBookingTour,
      nameTour,
      dayBookingTour,
      payment_status,
      status,
      page,
      limit,
    } = req.query;

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
  // [POST] /api/v1/booking/readAllFailBooking
  async readAllFailBooking(req, res) {
    const { page, limit } = req.query;

    try {
      const data = await BookingService.readAllFailBooking(req.query);
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

  // [POST] /api/v1/booking/create
  async createVNPAY(req, res, next) {
    const {
      ID_Calendar,
      ID_Customer,
      ID_Voucher,
      numberTicketAdult,
      numberTicketChild,
      user,
    } = req.body;
    if (!ID_Calendar || !ID_Customer || !numberTicketAdult) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await BookingService.createBookingVNPAY(req.body);
      console.log("data", data);
      req.dataBooking = data;
      next();
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server",
        EC: -5,
        DT: [],
      });
    }
  }

  async handleCreatePaymentVnpayUrl(req, res) {
    const dataBooking = req.dataBooking;

    try {
      const data = dataBooking.DT;
      let date = new Date();
      let createDate = moment(date).format("yyyyMMDDHHmmss");

      let ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      let tmnCode = config.get("vnp_TmnCode");
      let secretKey = config.get("vnp_HashSecret");
      let vnpUrl = config.get("vnp_Url");
      let returnUrl = config.get("vnp_ReturnUrl");

      let orderId = moment(date).format("DDHHmmss");

      let locale = "vn";
      let currCode = "VND";
      let vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = data.id;
      vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + data.id;
      vnp_Params["vnp_OrderType"] = "Thanh toan VNPAY";
      vnp_Params["vnp_Amount"] = data.total_money * 100;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;

      vnp_Params = sortObject(vnp_Params);

      let querystring = require("qs");
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require("crypto");
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

      return res.status(200).json({
        EC: 0,
        EM: "Đã tạo thanh toán",
        DT: {
          url: vnpUrl,
        },
      });
    } catch (error) {
      console.log(">>> error", error);
      return {
        EM: "Loi server !!!",
        EC: -5,
        DT: [],
      };
    }
  }

  async vnpay_return(req, res) {
    let config = require("config");
    let querystring = require("qs");
    let crypto = require("crypto");

    var vnp_Params = req.query;

    console.log("vnp_Params", vnp_Params);
    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    var secretKey = config.get("vnp_HashSecret");

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    // console.log("signed", signed);
    if (secureHash === signed) {
      var orderId = vnp_Params["vnp_TxnRef"];
      var rspCode = vnp_Params["vnp_ResponseCode"];

      const updateBooking = await BookingService.updateBooking({
        payment_status: "ĐÃ THANH TOÁN",
        id: orderId,
        // sendEmail: true,
      });

      return res.status(200).json({
        EC: 0,
        EM: "Tour đã được thanh toán thành công.",
        DT: updateBooking,
      });
    } else {
      return res.status(500).json({
        EC: -5,
        EM: "Đơn hàng thanh toán thất bại.",
        DT: [],
      });
    }
  }

  async cancelCalendarandNotificationBooking(req, res) {
    const { data } = req.body; 
    try {
      const data = await BookingService.cancelCalendarandNotificationBooking(
        req.body
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
}

function sortObject(obj) { 
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export default new Booking();

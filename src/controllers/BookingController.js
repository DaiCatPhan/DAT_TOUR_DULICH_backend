import BookingSerivce from "../services/BookingService";
import EmailService from "../services/EmailService";

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
      status,
      cancel_booking,
      date_cancel_booking,
      reason_cancel_booking,
    } = req.body;

    if (
      !ID_Calendar ||
      !ID_Customer ||
      !numberTicketAdult ||
      !numberTicketChild ||
      !payment_status
    ) {
      return res.status(200).json({
        EM: "Nhập thiếu trường dữ liệu !!!",
        EC: -2,
        DT: [],
      });
    }

    const rawData = {
      title,
      shortdescription,
      image: imageUrl,
      contentTEXT,
      contentHTML,
    };

    try {
      const data = await BlogService.createBlog(rawData);
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

export default new Booking();

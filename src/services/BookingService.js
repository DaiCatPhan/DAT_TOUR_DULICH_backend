import db from "../app/models";
const { Op } = require("sequelize");

// Đêm coi cái lịch đó có bao nhiều người đặt rồi ???? thêm điều kiện là != trạng thái đã hủy
const countBookingTourByIdCalendar = async (ID_Calendar) => {
  try {
    const calendars = await db.BookingTour.findAll({
      where: {
        ID_Calendar: ID_Calendar,
        cancel_booking: 0,
      },
      raw: true,
    });

    const conutTicket = calendars.reduce((total, calendar) => {
      return (
        total + (+calendar.numberTicketAdult + +calendar.numberTicketChild)
      );
    }, 0);

    return +conutTicket;
  } catch (error) {
    console.log("error", error);
    return 0;
  }
};

// Tính cái số chỗ còn lại của cái lịch đó
const remainingSeats = async (ID_Calendar) => {
  let countBookingByCalendar = await countBookingTourByIdCalendar(ID_Calendar);
  let calendarDetail = await db.Calendar.findOne({
    where: {
      id: ID_Calendar,
    },
  });

  return (+calendarDetail?.numberSeat || 0) - countBookingByCalendar || 0;
};

// Hàm tính tổng tiền
const prepareTheBill = async (a, b, priceA, priceB) => {
  return a * priceA + b * priceB;
};

// Hàm tính tiền theo Voucher
const applyVoucher = async (totalAmount, voucher) => {
  try {
    const currentDate = new Date();

    if (currentDate > new Date(voucher.toDate)) {
      return 0; // trường hợp hết hạn sử dụng
    }

    let discountAmount = 0;

    // Kiểm tra loại voucher
    if (voucher.typeVoucher === "money") {
      // Nếu loại voucher là giảm giá cố định theo số tiền
      if (totalAmount >= voucher.value) {
        // Kiểm tra nếu tổng số tiền cần thanh toán lớn hơn hoặc bằng giá trị voucher
        discountAmount = voucher.value;
      } else {
        // Nếu tổng số tiền cần thanh toán nhỏ hơn giá trị voucher, giảm giá bằng tổng số tiền cần thanh toán
        discountAmount = totalAmount;
      }
    } else if (voucher.typeVoucher === "percent") {
      // Nếu loại voucher là giảm giá theo phần trăm
      discountAmount = (voucher.value / 100) * totalAmount;
      // Giảm giá không vượt quá tổng số tiền cần thanh toán
      discountAmount = Math.min(discountAmount, totalAmount);
    }

    // Áp dụng giảm giá vào tổng số tiền và trả về số tiền phải thanh toán sau khi áp dụng voucher
    const amountAfterDiscount = totalAmount - discountAmount;

    return amountAfterDiscount;
  } catch (error) {
    // Xử lý lỗi nếu có
    console.log(">>> Error applying voucher:", error);
    throw new Error("Lỗi khi áp dụng voucher");
  }
};

const createBooking = async (rawData) => {
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
  } = rawData;

  try {
    const Calendar = await db.Calendar.findByPk(ID_Calendar, { raw: true });
    const Customer = await db.Calendar.findByPk(ID_Customer, { raw: true });

    if (!Customer) {
      return {
        EM: "Khách hàng không tồn tại",
        EC: -2,
        DT: [],
      };
    }

    if (!Calendar) {
      return {
        EM: "Lịch tour không tồn tại",
        EC: -2,
        DT: [],
      };
    }

    let tongveCon = await remainingSeats(ID_Calendar);
    let tongVeDat = +numberTicketAdult + +numberTicketChild;

    // console.log("tongveCon", tongveCon);
    // console.log("tongVeDat", tongVeDat);

    if (tongVeDat > tongveCon) {
      return {
        EM: "Hết chỗ !!!",
        EC: -2,
        DT: [],
      };
    }

    const condition = {};
    if (ID_Calendar) {
      condition.ID_Calendar = ID_Calendar;
    }
    if (ID_Customer) {
      condition.ID_Customer = ID_Customer;
    }
    if (ID_Voucher) {
      condition.ID_Voucher = ID_Voucher;
    }
    if (numberTicketAdult) {
      condition.numberTicketAdult = numberTicketAdult;
    }
    if (numberTicketChild) {
      condition.numberTicketChild = numberTicketChild;
    }
    if (payment_status) {
      condition.payment_status = payment_status;
    }

    //========================= Số tiền phải trả =============================

    const soTienPhaiTra = await prepareTheBill(
      numberTicketChild,
      numberTicketAdult,
      Calendar?.priceChild,
      Calendar?.priceAdult
    );

    // Kiểm tra và tính tiền theo voucher nếu có
    let soTienPhaiTraSauVoucher = soTienPhaiTra;
    if (ID_Voucher) {
      const Voucher = await db.Voucher.findByPk(ID_Voucher, { raw: true });
      if (Voucher) {
        // Xử lý logic tính tiền sau khi áp dụng voucher
        soTienPhaiTraSauVoucher = await applyVoucher(soTienPhaiTra, Voucher);
        if (soTienPhaiTraSauVoucher == 0) {
          return {
            EM: "Mã voucher đã hết hạn",
            EC: -2,
            DT: [],
          };
        }
      } else {
        return {
          EM: "Mã voucher không tồn tại",
          EC: -2,
          DT: [],
        };
      }
    }

    //========================= Số tiền đã thanh toán =============================

    // Số tiền đã thanh toán
    let soTienDaThanhToan = 0;
    // Xử lý phương thức thanh toán
    if (payment_method === "online") {
      soTienDaThanhToan = soTienPhaiTraSauVoucher;
      condition.payment_status = "Đã thanh toán";
    } else if (payment_method === "tại quầy") {
      soTienDaThanhToan = 0;
      condition.payment_status = "Chưa thanh toán";
    }

    //========================= Số tiền còn lại phải thanh toán =============================

    const soTienConLaiPhaiThanhToan =
      soTienPhaiTraSauVoucher - soTienDaThanhToan;

    condition.total_money = soTienPhaiTraSauVoucher;
    condition.paid_money = soTienDaThanhToan;
    condition.remaining_money = soTienConLaiPhaiThanhToan;

    condition.cancel_booking = 0;

    condition.payment_method = payment_method;
    condition.status = "Chờ xác nhận";

    const data = await db.BookingTour.create(condition);

    return {
      EM: "Đặt tour thành công ",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

const updateBooking = async (rawData) => {
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
  } = rawData;

  try {
    const bookingTour = await db.BookingTour.findByPk(id);

    if (!bookingTour) {
      return {
        EM: "Mã đặc tour không tồn tại",
        EC: -2,
        DT: [],
      };
    }

    const condition = {};
    if (status) {
      condition.status = status;
    }
    if (payment_method) {
      condition.payment_method = payment_method;
    }
    if (payment_status) {
      condition.payment_status = payment_status;
    }
    if (remaining_money) {
      condition.remaining_money = remaining_money;
    }

    if (cancel_booking) {
      condition.cancel_booking = cancel_booking;
    }
    if (date_cancel_booking) {
      condition.date_cancel_booking = date_cancel_booking;
    }
    if (reason_cancel_booking) {
      condition.reason_cancel_booking = reason_cancel_booking;
    }

    const data = await db.BookingTour.update(condition, {
      where: {
        id: id,
      },
    });

    return {
      EM: "Cập nhật đặt tour thành công ",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

const readBooking = async (rawData) => {
  try {
    const { status, ID_Customer, page, limit } = rawData;
    let offset = (page - 1) * +limit;

    const customer = await db.Customer.findByPk(ID_Customer);
    if (!customer) {
      return {
        EM: "Tài khoản khách hàng không tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }

    const condition = {};
    if (ID_Customer) {
      condition.ID_Customer = ID_Customer;
    }

    if (status) {
      condition.status = status;
    }

    const data = await db.BookingTour.findAndCountAll({
      where: condition,
      order: [["updatedAt", "DESC"]],
      limit: limit ? parseInt(limit) : undefined,
      offset: limit && page ? parseInt(offset) : undefined,
      include: [
        { model: db.Customer },
        { model: db.Calendar, include: { model: db.Tour } },
      ],
    });

    if (data) {
      return {
        EM: "Lấy dữ liệu thành công ",
        EC: 0,
        DT: data,
      };
    }
  } catch (err) {
    console.log(">> loi", err);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

const readAllBooking = async (rawData) => {
  try {
    const { status, page, limit } = rawData;
    let offset = (page - 1) * +limit;

    const condition = {};
    if (status) {
      condition.status = status;
    }

    const data = await db.BookingTour.findAndCountAll({
      where: condition,
      include: [
        { model: db.Customer },
        { model: db.Calendar, include: { model: db.Tour } },
      ],
      order: [["updatedAt", "DESC"]],
      limit: limit ? parseInt(limit) : undefined,
      offset: limit && page ? parseInt(offset) : undefined,
    });

    const Soluong_ChoXacNhan = await db.BookingTour.findAndCountAll({
      where: {
        status: "CHỜ XÁC NHẬN",
      },
    });
    const Soluong_DaDuyet = await db.BookingTour.findAndCountAll({
      where: {
        status: "ĐÃ DUYỆT",
      },
    });
    const Soluong_ChoHuy = await db.BookingTour.findAndCountAll({
      where: {
        status: "CHỜ HỦY",
      },
    });
    const Soluong_DaHuy = await db.BookingTour.findAndCountAll({
      where: {
        status: "ĐÃ HỦY",
      },
    });

    data.numberStatus = {
      Soluong_ChoXacNhan: Soluong_ChoXacNhan,
      Soluong_DaDuyet: Soluong_DaDuyet,
      Soluong_ChoHuy: Soluong_ChoHuy,
      Soluong_DaHuy: Soluong_DaHuy,
    };

    if (data) {
      return {
        EM: "Lấy dữ liệu thành công ",
        EC: 0,
        DT: data,
      };
    }
  } catch (err) {
    console.log(">> loi", err);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

const createCancelBooking = async (rawData) => {
  const { id, date_cancel_booking, reason_cancel_booking } = rawData;

  try {
    const booking = await db.BookingTour.findByPk(id, { raw: true });

    if (!booking) {
      return {
        EM: "Tour đặt không tồn tại",
        EC: -2,
        DT: [],
      };
    }

    const condition = {};

    if (date_cancel_booking) {
      condition.date_cancel_booking = date_cancel_booking;
    }
    if (reason_cancel_booking) {
      condition.reason_cancel_booking = reason_cancel_booking;
    }

    condition.cancel_booking = 1;
    condition.status = "Chờ hủy";

    console.log("condition", condition);

    const data = await db.BookingTour.update(condition, {
      where: {
        id: id,
      },
    });

    return {
      EM: "Gửi yêu cầu hủy tour thành công ",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

export default {
  createBooking,
  updateBooking,
  readBooking,
  readAllBooking,
  createCancelBooking,
};

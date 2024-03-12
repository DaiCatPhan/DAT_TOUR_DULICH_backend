import db from "../app/models";
const { Op } = require("sequelize");

// Đêm coi cái lịch đó có bao nhiều người đặt rồi ???? thêm điều kiện là != trạng thái đã hủy
const countBookingTourByIdCalendar = async (idCalendar) => {
  try {
    let calendars = await db.BookingTour.findAll({
      where: {
        idCalendar: idCalendar,
      },
      raw: true,
    });
    const conutTicket = calendars.reduce((total, calendar) => {
      return total + +calendar.numberTicketAdult + +calendar.numberTicketChild;
    }, 0);

    return +conutTicket;
  } catch (error) {
    console.log("error", error);
    return 0;
  }
};

// Tính cái số chỗ còn lại của cái lịch đó
const remainingSeats = async (idCalendar) => {
  let countBookingByCalendar = await countBookingTourByIdCalendar(idCalendar);

  let calendarDetail = await db.Calendar.findOne({
    where: {
      id: idCalendar,
    },
  });

  return (+calendarDetail?.numberSeat || 0) - countBookingByCalendar || 0;
};

// Hàm tính tổng tiền
const prepareTheBill = async (a, b, priceA, priceB) => {
  return a * priceA + b * priceB;
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
    status,
    cancel_booking,
    date_cancel_booking,
    reason_cancel_booking,
  } = rawData;

  try {
    const Calendar = await db.Calendar.findByPk(ID_Calendar);
    const Customer = await db.Calendar.findByPk(ID_Customer);

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

    // Kiểm tra chỗ ngồi
    let tongveCon = await remainingSeats(ID_Calendar);
    let tongVeDat = numberTicketAdult + numberTicketChild;

    if (tongVeDat > tongveCon) {
      return {
        EM: "Hết chỗ !!!",
        EC: 2,
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

export default { createBooking };

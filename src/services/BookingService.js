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

export default { countBookingTourByIdCalendar, remainingSeats };

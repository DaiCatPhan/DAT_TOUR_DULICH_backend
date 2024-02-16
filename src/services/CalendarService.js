import db from "../app/models";

const createCalender = async (rawData) => {
  try {
    const { ID_Tour, numberSeat, startDay, endDay, priceAdult, priceChild } =
      rawData;

    const exitTour = await db.Tour.findByPk(ID_Tour);
    if (!exitTour) {
      return {
        EM: "Tour không tồn tại !!! ",
        EC: -2,
        DT: [],
      };
    }

    // Kiểm tra startDay phải lớn hơn hoặc bằng ngày hiện tại

    const startDateTime = new Date(startDay);
    const currentDateTime = new Date();

    console.log("startDateTime", startDateTime);
    console.log("currentDateTime", currentDateTime);

    if (startDateTime <= currentDateTime) {
      return {
        EM: "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại",
        EC: -3,
        DT: [],
      };
    }

    // Kiểm tra endDay phải lớn hơn hoặc bằng ngày startDay
    if (new Date(endDay) <= new Date(startDay)) {
      return {
        EM: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
        EC: -3,
        DT: [],
      };
    }

    const dataCalendar = await db.Calendar.create({
      ID_Tour: ID_Tour,
      numberSeat: numberSeat,
      startDay: startDay,
      endDay: endDay,
      priceAdult: priceAdult,
      priceChild: priceChild,
    });

    return {
      EM: "Tạo lịch thành công ",
      EC: 0,
      DT: dataCalendar,
    };
  } catch (error) {
    console.log(">> error", error);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

export default { createCalender };

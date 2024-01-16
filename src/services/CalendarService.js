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

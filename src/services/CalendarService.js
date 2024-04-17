import db from "../app/models";
import moment from "moment";

const createCalender = async (rawData) => {
  try {
    const {
      ID_Tour,
      numberSeat,
      startDay,
      endDay,
      priceAdult,
      priceChild,
      status,
    } = rawData;

    const exitTour = await db.Tour.findByPk(ID_Tour);
    if (!exitTour) {
      return {
        EM: "Tour không tồn tại !!! ",
        EC: -2,
        DT: [],
      };
    }

    // Kiểm tra startDay phải lớn hơn hoặc bằng ngày hiện tại

    const startDateTime = startDay;
    const currentDateTime = new Date();

    if (startDateTime < currentDateTime) {
      return {
        EM: "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại",
        EC: -3,
        DT: [],
      };
    }

    // Kiểm tra endDay phải lớn hơn hoặc bằng ngày startDay
    if (endDay < startDay) {
      return {
        EM: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
        EC: -3,
        DT: [],
      };
    }

    const dataCreate = {
      ID_Tour: ID_Tour,
      numberSeat: numberSeat,
      startDay: moment(startDay).format("YYYY-MM-DD"),
      endDay: moment(endDay).format("YYYY-MM-DD"),
      priceAdult: priceAdult,
      priceChild: priceChild,
      status: status,
    };

    const dataCalendar = await db.Calendar.create(dataCreate);

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

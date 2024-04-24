import db from "../app/models";
import moment from "moment";

const max = (a, b) => {
  if (a > b) {
    return a;
  }
  return b;
};

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

    const tour = await db.Tour.findByPk(ID_Tour, { raw: true, nest: true });
    if (!tour) {
      return {
        EM: "Tour không tồn tại !!! ",
        EC: -2,
        DT: [],
      };
    }

    // Kiểm tra startDay phải lớn hơn hoặc bằng ngày hiện tại

    const startDateTime = new Date(startDay);
    const endDateTime = new Date(endDay);

    const currentDateTime = new Date();

    if (startDateTime < currentDateTime) {
      return {
        EM: "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại",
        EC: -3,
        DT: [],
      };
    }

    // Kiểm tra endDay phải lớn hơn hoặc bằng ngày startDay
    if (endDateTime < startDateTime) {
      return {
        EM: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
        EC: -3,
        DT: [],
      };
    }

    const numbeOfDayTour = tour?.numbeOfDay;
    const numberOfNightTour = tour?.numberOfNight;
    const durationTour = max(numbeOfDayTour, numberOfNightTour);

    const calculatedEndDate = new Date(startDay);

    calculatedEndDate.setDate(calculatedEndDate.getDate() + (durationTour - 1));

    // So sánh ngày kết thúc tính toán được với ngày kết thúc của lịch
    if (calculatedEndDate.toISOString() !== new Date(endDay).toISOString()) {
      return {
        EM: "Ngày kết thúc không phù hợp với số ngày của tour.",
        EC: -3,
        DT: [],
      };
    }

    const dataCreate = {
      ID_Tour: ID_Tour,
      numberSeat: numberSeat,
      startDay: startDateTime,
      endDay: endDateTime,
      priceAdult: priceAdult,
      priceChild: priceChild,
      status: "1",
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

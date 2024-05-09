import { where } from "sequelize";
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

const createWithMonth = async (rawData) => {
  try {
    const {
      ID_Tour,
      numberSeat,
      startDay,
      endDay,
      priceAdult,
      priceChild,
      status,
      numberMonth,
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

    let startDateTime = new Date(startDay);
    let endDateTime = new Date(endDay);

    const currentDateTime = new Date();

    if (startDateTime < currentDateTime) {
      return {
        EM: "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại",
        EC: -3,
        DT: [],
      };
    }

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

    for (let i = 0; i < numberMonth; i++) {
      let dataCreate = {
        ID_Tour: ID_Tour,
        numberSeat: numberSeat,
        startDay: startDateTime,
        endDay: endDateTime,
        priceAdult: priceAdult,
        priceChild: priceChild,
        status: "1",
      };

      await db.Calendar.create(dataCreate);

      startDateTime = moment(startDateTime).add(7, "day");
      endDateTime = moment(startDateTime).add(durationTour - 1, "day");
    }

    return {
      EM: "Tạo lịch thành công ",
      EC: 0,
      DT: [],
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

const updateCalendar = async (rawData) => {
  try {
    const {
      ID_Calendar,
      ID_Tour,
      numberSeat,
      startDay,
      endDay,
      priceAdult,
      priceChild,
      status,
    } = rawData;

    const calendar = await db.Calendar.findByPk(ID_Calendar, {
      raw: true,
      nest: true,
    });
    if (!calendar) {
      return {
        EM: "Lịch không tồn tại !!! ",
        EC: -2,
        DT: [],
      };
    }

    const condition = {};
    if (numberSeat) {
      condition.numberSeat = numberSeat;
    }
    if (priceAdult) {
      condition.priceAdult = priceAdult;
    }
    if (priceChild) {
      condition.priceChild = priceChild;
    }
    if (status) {
      condition.status = status;
    }

    const dataCalendar = await db.Calendar.update(condition, {
      where: {
        id: ID_Calendar,
      },
    });

    return {
      EM: "Cập nhật lịch thành công ",
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

const deleted = async (rawData) => {
  try {
    const { ID_Calendar } = rawData;

    const calendar = await db.Calendar.findByPk(ID_Calendar, {
      raw: true,
      nest: true,
    });
    if (!calendar) {
      return {
        EM: "Tour không tồn tại !!! ",
        EC: -2,
        DT: [],
      };
    }

    // Kiểm tra xem lịch này đã có người đặt hay chưa nếu có thì không được xóa

    const checkCalendar = await db.BookingTour.findOne({
      raw: true,
      nest: true,

      where: {
        ID_Calendar: ID_Calendar,
      },
    });

    if (checkCalendar) {
      return {
        EM: "Lịch này đã có khách hàng đặt tour , không xóa được !!!",
        EC: -2,
        DT: [],
      };
    }

    const deleteCalendar = await db.Calendar.destroy({
      where: {
        id: ID_Calendar,
      },
    });

    return {
      EM: "Xóa lịch thành công ",
      EC: 0,
      DT: deleteCalendar,
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

export default { createCalender, createWithMonth, updateCalendar, deleted };

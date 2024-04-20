import db from "../app/models";
import BookingService from "./BookingService";
const { Op } = require("sequelize");

const checkTourName = async (nameTour) => {
  let tourExit = null;
  tourExit = await db.Tour.findOne({
    where: {
      name: nameTour,
    },
    raw: true,
  });

  if (tourExit === null) {
    return false;
  }
  return true;
};

const createTour = async (rawData) => {
  const {
    name,
    type,
    priceAdult,
    priceChild,
    numbeOfDay,
    numberOfNight,
    status,
    vehicle,
  } = rawData;
  const checkTourExit = await checkTourName(name);
  if (checkTourExit) {
    return {
      EM: "Tên tour đã tồn tại !!!",
      EC: -1,
      DT: [],
    };
  }

  try {
    const data = await db.Tour.create({
      name: name,
      type: type,
      priceAdult: priceAdult,
      priceChild: priceChild,
      numbeOfDay: numbeOfDay,
      numberOfNight: numberOfNight,
      vehicle: vehicle,
      status: status,
    });

    return {
      EM: "Tạo Tour thành công ",
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

const updateTour = async (rawData) => {
  const {
    id,
    name,
    type,
    priceAdult,
    priceChild,
    numbeOfDay,
    numberOfNight,
    status,
    vehicle,
  } = rawData;
  const checkTourExit = await db.Tour.findByPk(+id);
  if (!checkTourExit) {
    return {
      EM: "Tour không tồn tại !!!",
      EC: -1,
      DT: [],
    };
  }

  try {
    const data = await db.Tour.update(
      {
        name: name,
        type: type,
        priceAdult: priceAdult,
        priceChild: priceChild,
        numbeOfDay: numbeOfDay,
        numberOfNight: numberOfNight,
        vehicle: vehicle,
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return {
      EM: "Cập nhật Tour thành công ",
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

const UpImageTour = async (rawData) => {
  const { ID_Tour, image } = rawData;

  try {
    let tour = await db.Tour.findByPk(ID_Tour);

    if (!tour) {
      return {
        EM: "Tour không tồn tại !!! ",
        EC: -3,
        DT: [],
      };
    }

    await tour.update({
      image: image,
    });

    return {
      EM: "Cập nhật ảnh tour thành công ",
      EC: 0,
      DT: tour,
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

const getTourWithPagination = async (rawData) => {
  const { id, name, page, limit, type, startDay } = rawData;
  try {
    const offset = (page - 1) * limit;
    const whereCondition = {};

    if (id) {
      whereCondition.id = +id;
    }

    if (name) {
      whereCondition.name = { [Op.like]: `%${name}%` };
    }

    if (type) {
      whereCondition.type = { [Op.like]: `%${type}%` };
    }

    if (startDay) {
      const options = {
        where: whereCondition,
        limit: limit ? parseInt(limit) : undefined,
        offset: limit && page ? parseInt(offset) : undefined,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.Calendar,
            where: {
              startDay: {
                [Op.gte]: startDay,
              },
            },
          },
          { model: db.ProcessTour },
        ],
      };

      const { count, rows } = await db.Tour.findAndCountAll(options);
      let data = {
        totalRows: count,
        tours: rows,
      };
      return {
        EM: "Lấy dữ liệu thành công ",
        EC: 0,
        DT: data,
      };
    }

    const options = {
      where: whereCondition,
      limit: limit ? parseInt(limit) : undefined,
      offset: limit && page ? parseInt(offset) : undefined,
      include: [
        {
          model: db.Calendar,
        },
        { model: db.ProcessTour },
      ],
    };

    const { count, rows } = await db.Tour.findAndCountAll(options);
    let data = {
      totalRows: count,
      tours: rows,
    };
    return {
      EM: "Lấy dữ liệu thành công ",
      EC: 0,
      DT: data,
    };
  } catch (err) {
    console.log(">> loi", err);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

const getToursFilter = async (rawData) => {
  const {
    id,
    name,
    page,
    limit,
    type,
    startDay,
    status,
    sortByPrice,
    sortByStartDate,
    sortByDuration,
    sortBycreatedAt,
    sortOrder,
  } = rawData;

  try {
    const offset = (page - 1) * limit;
    const whereCondition = {};

    if (id) {
      whereCondition.id = +id;
    }

    if (name) {
      whereCondition.name = { [Op.like]: `%${name}%` };
    }

    if (type) {
      whereCondition.type = { [Op.like]: `%${type}%` };
    }

    if (status) {
      whereCondition.status = status;
    }

    // LOI
    if (startDay) {
      const options = {
        where: whereCondition,
        limit: limit ? parseInt(limit) : undefined,
        offset: limit && page ? parseInt(offset) : undefined,

        include: [
          {
            model: db.Calendar,
            where: {
              startDay: {
                [Op.gte]: startDay,
              },
            },
            raw: true,
            nest: true,
          },
          { model: db.ProcessTour, raw: true, nest: true },
        ],
      };

      const { count, rows } = await db.Tour.findAndCountAll(options);

      console.log("startDay", rows);
      let data = {
        totalRows: count,
        tours: rows,
      };
      return {
        EM: "Lấy dữ liệu thành công ",
        EC: 0,
        DT: data,
      };
    }

    let options = {
      where: whereCondition,
      limit: limit ? parseInt(limit) : undefined,
      offset: limit && page ? parseInt(offset) : undefined,
      include: [
        {
          model: db.Calendar,
          raw: true,
          nest: true,
        },
        { model: db.ProcessTour, raw: true, nest: true },
      ],
    };

    if (sortBycreatedAt && sortOrder) {
      options.order = [["createdAt", sortOrder]];
    }

    if (sortByPrice && sortOrder) {
      options.order = [["priceAdult", sortOrder]];
    }

    if (sortByDuration && sortOrder) {
      options.order = [["numbeOfDay", sortOrder]];
    }

    // LOI
    if (sortByStartDate && sortOrder) {
      const options = {
        where: whereCondition,
        limit: limit ? parseInt(limit) : undefined,
        offset: limit && page ? parseInt(offset) : undefined,
        include: [
          {
            model: db.Calendar,
            ...(startDay && {
              where: {
                startDay: {
                  [Op.gte]: startDay,
                },
              },
            }),
          },
          { model: db.ProcessTour },
        ],
        raw: true,
        nest: true,
      };
      const { count, rows } = await db.Tour.findAndCountAll(options);
      console.log("rows", rows);

      return {
        EM: "Lấy dữ liệu thành công ",
        EC: 0,
        DT: rows,
      };
    }

    const { count, rows } = await db.Tour.findAndCountAll(options);

    let data = {
      totalRows: count,
      tours: rows,
    };

    return {
      EM: "Lấy dữ liệu thành công ",
      EC: 0,
      DT: data,
    };
  } catch (err) {
    console.log(">> loi", err);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

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

const getTourDetailById = async (rawData) => {
  const { id, sortCalendar, numberCalenadar, getAll } = rawData;
  try {
    let dataTour = await db.Tour.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: db.ProcessTour,
        },
      ],
      raw: true,
      nest: true,
    });

    if (!dataTour) {
      return {
        EM: "Tour không tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }

    let options = {
      where: {
        ID_Tour: id,
      },
      raw: true,
      nest: true,
    };
    // Sắp xếp
    if (sortCalendar === "ASC" || sortCalendar === "DESC") {
      options.order = [["startDay", sortCalendar]];
    }
    // Lấy số lịch của tour đó là bao nhiêu
    if (numberCalenadar) {
      options.limit = +numberCalenadar;
    }
    let dataTourCalendar = await db.Calendar.findAll(options);

    // Lấy hết tích or lấy lịch lớn hơn nhày hiện tại
    if (getAll && getAll == "false") {
      const currentDate = new Date();
      const filteredCalendar = dataTourCalendar.filter((item) => {
        const startDate = new Date(item.startDay);
        return startDate > currentDate;
      });
      dataTour.Calendars = filteredCalendar;
    } else {
      dataTour.Calendars = dataTourCalendar;
    }

    // Tính số chỗ còn lại
    if (dataTour) {
      const handleCalendarPromise = dataTour.Calendars.map(async (item) => {
        const sochoConali = await remainingSeats(item.id);
        return {
          ...item,
          remainingSeats: sochoConali,
        };
      });
      const result = await Promise.all(handleCalendarPromise);
      dataTour.Calendars = result;

      return {
        EM: "Lấy dữ liệu thành công ",
        EC: 0,
        DT: dataTour,
      };
    }
  } catch (error) {
    console.log(">> error", error);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

export default {
  createTour,
  UpImageTour,
  getTourWithPagination,
  getTourDetailById,
  updateTour,
  getToursFilter,
};

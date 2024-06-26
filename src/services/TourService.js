import db, { sequelize } from "../app/models";
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
  const { id, name, page, limit, type } = rawData;
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
            status: "1",
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
    };
    if (limit && offset) {
      options.limit = +limit;
      options.offset = +offset;
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

function removeAccentsAndLowerCase(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const getToursFilter = async (rawData) => {
  const {
    id,
    name,
    page,
    limit,
    type,
    priceStart,
    priceEnd,
    startDay,
    startDayEnd,
    status,
    sortByStar,
    sortBooking,
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
      const wordsToSearch = removeAccentsAndLowerCase(name)
        .split(/\s+/)
        .filter(Boolean);
      const wordConditions = wordsToSearch.map((word) => ({
        [Op.like]: `%${word}%`,
      }));

      whereCondition.name = { [Op.and]: wordConditions };
    }

    if (type) {
      whereCondition.type = { [Op.like]: `%${type}%` };
    }
    
    if (priceStart) {
      whereCondition.priceAdult = { [Op.gt]: priceStart };
    }
    if (priceEnd) {
      whereCondition.priceAdult = { [Op.lt]: priceEnd };
    }
    if (priceStart && priceEnd) {
      whereCondition.priceAdult = { [Op.between]: [priceStart, priceEnd] };
    }

    if (status) {
      whereCondition.status = status;
    }

    const conditionCalendar = {};
    if (startDay) {
      conditionCalendar.startDay = { [Op.gt]: new Date(startDay) };
    }

    if (startDay && startDayEnd) {
      conditionCalendar.startDay = {
        [Op.and]: [{ [Op.gt]: startDay }, { [Op.lt]: startDayEnd }],
      };
    }

    let options = {
      raw: true,
      nest: true,
      where: whereCondition,
      limit: limit ? parseInt(limit) : undefined,
      offset: limit && page ? parseInt(offset) : undefined,
      include: [{ model: db.ProcessTour }],
    };

    if (sortBycreatedAt && sortOrder) {
      options.order = [["createdAt", sortOrder]];
    }

    if (sortByPrice && sortOrder) {
      options.order = [["priceAdult", sortOrder]];
    }

    if (sortByDuration && sortOrder) {
      options.order = [
        [sequelize.literal("GREATEST(numbeOfDay, numberOfNight)"), sortOrder],
      ];
    }

    if (sortByStartDate && sortOrder) {
      const tours = await db.Tour.findAndCountAll({
        raw: true,
        nest: true,
        where: whereCondition,
      });

      const tourPromiseArray = tours?.rows?.map(async (tour) => {
        const Calendar = await db.Calendar.findAll({
          raw: true,
          nest: true,

          where: {
            startDay: {
              [Op.gte]: new Date(),
            },
            ID_Tour: tour.id,
          },
          order: [["startDay", "ASC"]],
          limit: 1,
        });

        return {
          ...tour,
          Calendars: Calendar,
        };
      });

      const TourChuaLichGanNhat_LonHonNgaHienTai = await Promise.all(
        tourPromiseArray
      );

      let sortedArray = [];
      if (sortOrder == "ASC") {
        sortedArray = TourChuaLichGanNhat_LonHonNgaHienTai.sort((a, b) => {
          const startDayA = a.Calendars?.[0]?.startDay
            ? new Date(a.Calendars[0].startDay)
            : null;

          const startDayB = b.Calendars?.[0]?.startDay
            ? new Date(b.Calendars[0].startDay)
            : null;

          if (!startDayA && startDayB) {
            return 1;
          } else if (startDayA && !startDayB) {
            return -1;
          } else if (!startDayA && !startDayB) return 0;
          else {
            return startDayA - startDayB;
          }
        });
      } else if (sortOrder == "DESC") {
        sortedArray = TourChuaLichGanNhat_LonHonNgaHienTai.sort((a, b) => {
          const startDayA = a.Calendars?.[0]?.startDay
            ? new Date(a.Calendars[0].startDay)
            : null;

          const startDayB = b.Calendars?.[0]?.startDay
            ? new Date(b.Calendars[0].startDay)
            : null;

          if (!startDayA && startDayB) {
            return 1;
          } else if (startDayA && !startDayB) {
            return -1;
          } else if (!startDayA && !startDayB) return 0;
          else {
            return startDayB - startDayA;
          }
        });
      }

      return {
        EM: "Lấy dữ liệu thành công ",
        EC: 0,
        DT: {
          totalRows: tours.count,
          tours: sortedArray,
        },
      };
    }

    if (sortBooking && sortOrder) {
      const tours = await db.Tour.findAndCountAll({
        raw: true,
        nest: true,
        where: whereCondition,
      });

      const tourPromiseArray = tours?.rows?.map(async (tour) => {
        const Calendar = await db.Calendar.findAll({
          raw: true,
          nest: true,

          where: {
            startDay: {
              [Op.gte]: new Date(),
            },
            ID_Tour: tour.id,
          },
          order: [["startDay", "ASC"]],
          limit: 1,
        });
        const calendarNumberBooking = await db.BookingTour.findAndCountAll({
          raw: true,
          nest: true,

          include: [
            {
              model: db.Calendar,
              where: {
                ID_Tour: tour.id,
              },
            },
          ],
        });
        const numberBookingTour = calendarNumberBooking?.rows?.reduce(
          (total, item) => {
            return total + (item.numberTicketAdult + item.numberTicketChild);
          },
          0
        );

        return {
          ...tour,
          Calendars: Calendar,
          booking: numberBookingTour,
        };
      });

      const demsoDonDacTour = await Promise.all(tourPromiseArray);

      let sortedArray = [];
      if (sortOrder == "ASC") {
        sortedArray = demsoDonDacTour.sort((a, b) => {
          const numberBookingA = a ? a.booking : null;
          const numberBookingB = b ? b.booking : null;

          return numberBookingA - numberBookingB;
        });
      } else if (sortOrder == "DESC") {
        sortedArray = demsoDonDacTour.sort((a, b) => {
          const numberBookingA = a ? a.booking : null;
          const numberBookingB = b ? b.booking : null;

          return numberBookingB - numberBookingA;
        });
      }

      return {
        EM: "Lấy dữ liệu thành công ",
        EC: 0,
        DT: {
          totalRows: tours.count,
          tours: sortedArray,
        },
      };
    }

    if (sortByStar && sortOrder) {
      const tours = await db.Tour.findAndCountAll({
        raw: true,
        nest: true,
        where: whereCondition,
      });

      const tourPromiseArray = tours?.rows?.map(async (tour) => {
        const comments = await db.Comment.findAll({
          raw: true,
          nest: true,

          where: {
            ID_Tour: tour.id,
          },
        });

        let totalStars = 0;
        comments.forEach((comment) => {
          totalStars += comment.star;
        });

        let averageStars = 0;
        if (comments.length > 0) {
          averageStars = totalStars / comments.length;
        }

        return {
          ...tour,
          averageStars: averageStars,
        };
      });

      const sortStarTour = await Promise.all(tourPromiseArray);

      let sortedArray = [];
      if (sortOrder == "ASC") {
        sortedArray = sortStarTour.sort((a, b) => {
          const numberAverageStarsA = a ? a.averageStars : null;
          const numberAverageStarsB = b ? b.averageStars : null;

          return numberAverageStarsA - numberAverageStarsB;
        });
      } else if (sortOrder == "DESC") {
        sortedArray = sortStarTour.sort((a, b) => {
          const numberAverageStarsA = a ? a.averageStars : null;
          const numberAverageStarsB = b ? b.averageStars : null;

          return numberAverageStarsB - numberAverageStarsA;
        });
      }

      return {
        EM: "Lấy dữ liệu thành công ",
        EC: 0,
        DT: {
          totalRows: tours.count,
          tours: sortedArray,
        },
      };
    }

    const { count, rows } = await db.Tour.findAndCountAll(options);

    const rowsCustom = rows.map(async (item) => {
      let calendar = await db.Calendar.findAll({
        where: {
          ID_Tour: item.id,
          ...conditionCalendar,
        },
      });
      return {
        ...item,
        Calendars: calendar,
      };
    });

    let rowsCustomPromise = await Promise.all(rowsCustom);

    if (startDay) {
      const rowsCustomPromiseFilter = rowsCustomPromise.filter((item) => {
        return item?.Calendars?.length > 0;
      });
      let data = {
        totalRows: count,
        tours: rowsCustomPromiseFilter,
      };

      return {
        EM: "Lấy dữ liệu thành công ",
        EC: 0,
        DT: data,
      };
    }

    let data = {
      totalRows: count,
      tours: rowsCustomPromise,
    };

    return {
      EM: "Lấy dữ liệu thành công ",
      EC: 0,
      DT: data,
    };
  } catch (err) {
    console.log(">> loi >>>", err);
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
  const { id, statusCalendar, sortStartDayCalendar, numberCalenadar, getAll } =
    rawData;
  try {
    let Tour = await db.Tour.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: db.ProcessTour,
          raw: true,
          nest: true,
        },
      ],
      raw: true,
      nest: true,
    });

    const optionsCalendar = {
      where: {
        ID_Tour: id,
      },
      raw: true,
      nest: true,
    };

    if (statusCalendar) {
      optionsCalendar.where.status = statusCalendar;
    }

    // Sắp xếp
    if (sortStartDayCalendar) {
      optionsCalendar.order = [["startDay", sortStartDayCalendar]];
    }
    // Lấy số lịch của tour đó là bao nhiêu
    if (numberCalenadar) {
      optionsCalendar.limit = +numberCalenadar;
    }

    // Lấy hết tích or lấy lịch lớn hơn nhày hiện tại
    if (getAll != "true") {
      optionsCalendar.where.startDay = {
        [Op.gte]: new Date(),
      };
    }

    const Calendar = await db.Calendar.findAll(optionsCalendar);
    Tour.Calendars = Calendar;

    // Tính số chỗ còn lại

    const handleCalendarPromise = Tour.Calendars.map(async (item) => {
      const sochoConali = await remainingSeats(item.id);
      return {
        ...item,
        remainingSeats: sochoConali,
      };
    });
    const result = await Promise.all(handleCalendarPromise);
    Tour.Calendars = result;

    // TÍNH SỐ LƯỢT ĐẶT TOUR CỦA MỖI LỊCH
    let bookingTour = await db.BookingTour.findAndCountAll({
      raw: true,
      nest: true,
    });

    Tour?.Calendars?.forEach((item) => {
      let numberBill = 0;
      let numberTicket = 0;

      bookingTour.rows.forEach((booking) => {
        if (booking.ID_Calendar == item.id) {
          numberBill += 1;
          numberTicket +=
            (booking.numberTicketAdult || 0) + (booking.numberTicketChild || 0);
        }
      });

      item.booking = {
        numberBill: numberBill,
        numberTicket: numberTicket,
      };
    });

    return {
      EM: "Lấy dữ liệu thành công ",
      EC: 0,
      DT: Tour,
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

const readAllMostPopular = async (rawData) => {
  const { page, limit, sortBooking, sortOrder, status } = rawData;

  try {
    const offset = (page - 1) * limit;
    const conditionTour = {};
    if (status) {
      conditionTour.status = status;
    }

    if (sortBooking && sortOrder) {
      const tours = await db.Tour.findAndCountAll({
        raw: true,
        nest: true,
        where: conditionTour,
      });

      const tourPromiseArray = tours?.rows?.map(async (tour) => {
        const calendarNumberBooking = await db.BookingTour.findAndCountAll({
          raw: true,
          nest: true,

          include: [
            {
              model: db.Calendar,
              where: {
                ID_Tour: tour.id,
              },
            },
          ],
        });
        const numberBookingTour = calendarNumberBooking?.rows?.reduce(
          (total, item) => {
            return total + (item.numberTicketAdult + item.numberTicketChild);
          },
          0
        );

        return {
          ...tour,
          booking: numberBookingTour,
        };
      });

      const demsoDonDacTour = await Promise.all(tourPromiseArray);

      let sortedArray = [];
      if (sortOrder == "ASC") {
        sortedArray = demsoDonDacTour.sort((a, b) => {
          const numberBookingA = a ? a.booking : null;
          const numberBookingB = b ? b.booking : null;

          return numberBookingA - numberBookingB;
        });
      } else if (sortOrder == "DESC") {
        sortedArray = demsoDonDacTour.sort((a, b) => {
          const numberBookingA = a ? a.booking : null;
          const numberBookingB = b ? b.booking : null;

          return numberBookingB - numberBookingA;
        });
      }

      const totalRows = sortedArray.length;
      const slicedArray = sortedArray.slice((page - 1) * limit, page * limit);

      return {
        EM: "Lấy dữ liệu thành công ",
        EC: 0,
        DT: {
          totalRows: totalRows,
          tours: slicedArray,
        },
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

export default {
  createTour,
  UpImageTour,
  getTourWithPagination,
  getTourDetailById,
  updateTour,
  getToursFilter,
  readAllMostPopular,
};

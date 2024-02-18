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
  const { name, type, priceAdult, priceChild, duration, status, vehicle } =
    rawData;
  const checkTourExit = await checkTourName(name);
  if (checkTourExit) {
    return {
      EM: "Tour đã tồn tại !!!",
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
      duration: duration,
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
    duration,
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
        duration: duration,
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
  const { name, page, limit, type, startDate } = rawData;
  try {
    const offset = (page - 1) * limit;
    const whereCondition = {};

    if (name) {
      whereCondition.name = { [Op.like]: `%${name}%` };
    }

    if (type) {
      whereCondition.type = { [Op.like]: `%${type}%` };
    }

    if (startDate) {
      whereCondition.createdAt = { [Op.gte]: new Date(startDate) };
    }

    const options = {
      where: whereCondition,
      limit: limit ? parseInt(limit) : undefined,
      offset: limit && page ? parseInt(offset) : undefined,
      order: [["createdAt", "DESC"]],
      include: [{ model: db.Calendar }, { model: db.ProcessTour }],
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

const getTourDetailById = async (rawData) => {
  const { id } = rawData;
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

    let dataTourCalendar = await db.Calendar.findAll({
      where: {
        ID_Tour: id,
      },
      raw: true,
      nest: true,
    });

    dataTour.Calendars = dataTourCalendar;

    if (dataTour) {
      const handleCalendarPromise = dataTour.Calendars.map(async (item) => {
        const sochoConali = await BookingService.remainingSeats(item.id);
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
};

import db from "../app/models";
import { Op } from "sequelize";

const dashboard = async () => {
  try {
    const tour = await db.Tour.count();
    const user = await db.Customer.count();
    const donHang = await db.BookingTour.count({
      where: {
        status: 0,
      },
    });

    const data = {
      tour,
      user,
      donHang,
    };

    return {
      EM: "Lấy dữ liệu thành công",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log("error");
    return {
      EM: "Loi server",
      EC: -5,
      DT: [],
    };
  }
};

function isSameDate(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isSameMongth(date1, date2) {
  return (
    date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
  );
}

function isSameYear(date1, date2) {
  return date1.getDate() === date2.getDate();
}

const revenueTour = async (rawData) => {
  const { startDay, endDay, month, year } = rawData;

  try {
    const tours = await db.Tour.findAll({
      attributes: ["id", "name"],
      raw: true,
    });
    // Khởi tạo doanh thu của mỗi tour là 0
    tours.forEach((tour) => {
      tour.revenueDay = 0;
    });

    var bookings = [];

    if (startDay && !endDay) {
      const startOfStartDay = new Date(startDay);
      startOfStartDay.setUTCHours(0, 0, 0, 0);

      const endOfStartDay = new Date(startDay);
      endOfStartDay.setUTCHours(23, 59, 59, 999);

      bookings = await db.BookingTour.findAll({
        where: {
          createdAt: {
            [Op.between]: [startOfStartDay, endOfStartDay],
          },
          // status: "paid",
        },
        include: [
          {
            model: db.Calendar,
            include: {
              model: db.Tour,
              raw: true,
              nest: true,
            },
            raw: true,
            nest: true,
          },
        ],
        raw: true,
        nest: true,
      });
    }

    if (startDay && endDay) {
      bookings = await db.BookingTour.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDay, endDay],
          },
          // status: "paid",
        },
        include: [
          {
            model: db.Calendar,
            include: {
              model: db.Tour,
              raw: true,
              nest: true,
            },
            raw: true,
            nest: true,
          },
        ],
        raw: true,
        nest: true,
      });
    }

    if (month) {
      const [monthofYear, year] = month.split("/");
      const startDate = new Date(year, monthofYear - 1, 1);
      const endDate = new Date(year, monthofYear, 0);

      console.log("startDate", startDate);
      console.log("endDate", endDate);
      console.log("monthofYear", monthofYear);
      console.log("year", year);

      bookings = await db.BookingTour.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
          // payment_status: "paid",
        },
        include: [
          {
            model: db.Calendar,
            include: {
              model: db.Tour,
              raw: true,
              nest: true,
            },
            raw: true,
            nest: true,
          },
        ],
        raw: true,
        nest: true,
      });
    }

    console.log("bookings", bookings);

    // Tính doanh thu theo ngay cho từng tour
    bookings.forEach((booking) => {
      const tourId = booking.Calendar.Tour.id;
      const tour = tours.find((tour) => tour.id === tourId);
      if (tour) {
        tour.revenueDay += booking.total_money;
      }
    });

    return {
      EM: "Lấy dữ liệu thành công",
      EC: 0,
      DT: tours,
    };
  } catch (error) {
    console.log("error", error);
    return {
      EM: "Loi server",
      EC: -5,
      DT: [],
    };
  }
};

const revenueTours = async (rawData) => {
  const { startDay, endDay, month, year } = req.query;

  try {
    const tour = await db.Tour.count();
    const user = await db.Customer.count();
    const donHang = await db.BookingTour.count({
      where: {
        status: 0,
      },
    });

    const data = {
      tour,
      user,
      donHang,
    };

    return {
      EM: "Lấy dữ liệu thành công",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log("error");
    return {
      EM: "Loi server",
      EC: -5,
      DT: [],
    };
  }
};
export default { dashboard, revenueTour, revenueTours };

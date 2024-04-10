import db from "../app/models";
import { Op } from "sequelize";
import moment from "moment";
import { format } from "sequelize/lib/utils";

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
          status: "ĐÃ DUYỆT",
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
          status: "ĐÃ DUYỆT",
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

      bookings = await db.BookingTour.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
          status: "ĐÃ DUYỆT",
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

    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);

      bookings = await db.BookingTour.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
          status: "ĐÃ DUYỆT",
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

    // Tính doanh thu theo ngay cho từng tour
    bookings.forEach((booking) => {
      const tourId = booking.Calendar.Tour.id;
      const tour = tours.find((tour) => tour.id === tourId);
      if (tour) {
        tour.revenueDay += booking.total_money;
      }
    });

    if (startDay && !endDay) {
      return {
        EM: `Doanh thu từng tour ở ngày : ${moment(startDay).format(
          "DD-MM-YYYY"
        )}`,
        EC: 0,
        DT: tours,
      };
    }
    if (startDay && endDay) {
      return {
        EM: `Doanh thu từng tour bắt đầu từ ngày :  ${moment(startDay).format(
          "DD-MM-YYYY"
        )} - ${moment(endDay).format("DD-MM-YYYY")}`,
        EC: 0,
        DT: tours,
      };
    }
    if (month) {
      return {
        EM: "Doanh thu từng tour ở tháng : " + month,
        EC: 0,
        DT: tours,
      };
    }
    if (year) {
      return {
        EM: "Doanh thu từng tour ở năm : " + year,
        EC: 0,
        DT: tours,
      };
    }
  } catch (error) {
    console.log("error", error);
    return {
      EM: "Loi server",
      EC: -5,
      DT: [],
    };
  }
};

const revenueToursMonth = async (rawData) => {
  const { year } = rawData;

  try {
    const revenueByMonth = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const bookings = await db.BookingTour.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
          status: "ĐÃ DUYỆT",
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

      // Tính tổng doanh thu từ các booking của tháng hiện tại
      let monthlyRevenue = 0;
      bookings.forEach((booking) => {
        monthlyRevenue += booking.total_money;
      });

      revenueByMonth.push({ month: `Tháng ${month}`, value: monthlyRevenue });
    }
    return {
      EM: `Doanh thu tất cả các tháng năm ${year}`,
      EC: 0,
      DT: revenueByMonth,
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

const revenueToursOneYear = async (rawData) => {
  const { year } = rawData;

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  const bookings = await db.BookingTour.findAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
      status: "ĐÃ DUYỆT",
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

  // Tính tổng doanh thu từ các booking của tháng hiện tại
  let totalRevenueYear = 0;
  bookings.forEach((booking) => {
    totalRevenueYear += booking.total_money;
  });

  return totalRevenueYear;
};

const calculateRevenueForRecentYears = async (rawData) => {
  const { year } = rawData;
  let currentYear = new Date(year).getFullYear();
  let recentYears = [];

  // Lặp qua 5 năm gần nhất, bắt đầu từ năm hiện tại
  for (let i = 0; i < 5; i++) {
    const year = currentYear - i;
    const revenue = await revenueToursOneYear({ year });

    recentYears.push({ year, value: revenue });
  }
  recentYears.reverse();
  return {
    EM: `Biểu đồ doanh thu từng năm : ${year - 4} - ${year}`,
    EC: 0,
    DT: recentYears,
  };
};

export default {
  dashboard,
  revenueTour,
  revenueToursMonth,
  calculateRevenueForRecentYears,
};

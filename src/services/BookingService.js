import { raw } from "express";
import db, { Sequelize, sequelize } from "../app/models";
const { Op } = require("sequelize");
import moment from "moment";

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

// Hàm tính tổng tiền
const prepareTheBill = async (a, b, priceA, priceB) => {
  return a * priceA + b * priceB;
};

// Hàm tính tiền theo Voucher
const applyVoucher = async (totalAmount, voucher) => {
  try {
    const currentDate = new Date();

    if (currentDate > new Date(voucher.toDate)) {
      return 0; // trường hợp hết hạn sử dụng
    }

    let discountAmount = 0;

    // Kiểm tra loại voucher
    if (voucher.typeVoucher === "money") {
      // Nếu loại voucher là giảm giá cố định theo số tiền
      if (totalAmount >= voucher.value) {
        // Kiểm tra nếu tổng số tiền cần thanh toán lớn hơn hoặc bằng giá trị voucher
        discountAmount = voucher.value;
      } else {
        // Nếu tổng số tiền cần thanh toán nhỏ hơn giá trị voucher, giảm giá bằng tổng số tiền cần thanh toán
        discountAmount = totalAmount;
      }
    } else if (voucher.typeVoucher === "percent") {
      // Nếu loại voucher là giảm giá theo phần trăm
      discountAmount = (voucher.value / 100) * totalAmount;
      // Giảm giá không vượt quá tổng số tiền cần thanh toán
      discountAmount = Math.min(discountAmount, totalAmount);
    }

    // Áp dụng giảm giá vào tổng số tiền và trả về số tiền phải thanh toán sau khi áp dụng voucher
    const amountAfterDiscount = totalAmount - discountAmount;

    return amountAfterDiscount;
  } catch (error) {
    // Xử lý lỗi nếu có
    console.log(">>> Error applying voucher:", error);
    throw new Error("Lỗi khi áp dụng voucher");
  }
};

const updateBooking = async (rawData) => {
  const {
    id,
    ID_Calendar,
    ID_Customer,
    ID_Voucher,
    numberTicketAdult,
    numberTicketChild,
    total_money,
    remaining_money,
    payment_status,
    payment_method,
    status,
    cancel_booking,
    date_cancel_booking,
    reason_cancel_booking,
  } = rawData;

  try {
    const bookingTour = await db.BookingTour.findByPk(id);

    if (!bookingTour) {
      return {
        EM: "Mã đặc tour không tồn tại",
        EC: -2,
        DT: [],
      };
    }

    const condition = {};
    if (status) {
      condition.status = status;
    }
    if (payment_method) {
      condition.payment_method = payment_method;
    }
    if (payment_status) {
      condition.payment_status = payment_status;
    }
    if (remaining_money) {
      condition.remaining_money = remaining_money;
    }

    if (cancel_booking) {
      condition.cancel_booking = cancel_booking;
    }
    if (date_cancel_booking) {
      condition.date_cancel_booking = date_cancel_booking;
    }
    if (reason_cancel_booking) {
      condition.reason_cancel_booking = reason_cancel_booking;
    }

    const data = await db.BookingTour.update(condition, {
      where: {
        id: id,
      },
    });

    return {
      EM: "Cập nhật đặt tour thành công ",
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

const updatePaid = async (rawData) => {
  const { id, payment_status } = rawData;

  try {
    const bookingTour = await db.BookingTour.findByPk(id, { raw: true });

    if (!bookingTour) {
      return {
        EM: "Mã đặc tour không tồn tại",
        EC: -2,
        DT: [],
      };
    }

    const condition = {};
    if (payment_status) {
      condition.payment_status = payment_status;
    }
    condition.paid_money = bookingTour.total_money;
    condition.remaining_money = 0;

    const data = await db.BookingTour.update(condition, {
      where: {
        id: id,
      },
    });

    return {
      EM: "Cập nhật đặt tour thành công ",
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

const readBooking = async (rawData) => {
  try {
    const { status, ID_Customer, page, limit } = rawData;
    let offset = (page - 1) * +limit;

    const customer = await db.Customer.findByPk(ID_Customer);
    if (!customer) {
      return {
        EM: "Tài khoản khách hàng không tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }

    const condition = {};
    if (ID_Customer) {
      condition.ID_Customer = ID_Customer;
    }

    if (status) {
      condition.status = status;
    }

    const data = await db.BookingTour.findAndCountAll({
      where: condition,
      order: [["updatedAt", "DESC"]],
      limit: limit ? parseInt(limit) : undefined,
      offset: limit && page ? parseInt(offset) : undefined,
      include: [
        { model: db.Customer },
        { model: db.Calendar, include: { model: db.Tour } },
      ],
    });

    if (data) {
      return {
        EM: "Lấy dữ liệu thành công ",
        EC: 0,
        DT: data,
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

const readAllBooking = async (rawData) => {
  try {
    const {
      idBookingTour,
      nameTour,
      dayBookingTour,
      payment_status,
      sortcreatedAt,
      status,
      page,
      limit,
    } = rawData;

    let offset = (page - 1) * +limit;

    const condition = {};
    if (status) {
      condition.status = status;
    }
    if (payment_status) {
      condition.payment_status = payment_status;
    }
    if (idBookingTour) {
      condition.id = idBookingTour;
    }
    if (dayBookingTour) {
      // Lấy ngày bắt đầu của ngày được chỉ định
      const startOfDay = new Date(dayBookingTour);
      startOfDay.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây và millisecond về 0

      // Lấy ngày kết thúc của ngày được chỉ định
      const endOfDay = new Date(dayBookingTour);
      endOfDay.setHours(23, 59, 59, 999); // Đặt giờ, phút, giây và millisecond tới cuối ngày

      console.log("startOfDay", startOfDay);
      console.log("endOfDay", endOfDay);

      // Thêm điều kiện tìm kiếm để createdAt nằm trong phạm vi của ngày được chỉ định
      condition.createdAt = {
        [Op.between]: [startOfDay, endOfDay],
      };
    }

    function removeAccentsAndLowerCase(str) {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }

    if (nameTour) {
      const wordsToSearch = removeAccentsAndLowerCase(nameTour)
        .split(/\s+/)
        .filter(Boolean);
      const wordConditions = wordsToSearch.map((word) => ({
        [Op.like]: `%${word}%`,
      }));
      // Thêm điều kiện tìm kiếm theo nameTour trong bảng Tour
      condition["$Calendar.Tour.name$"] = { [Op.and]: wordConditions };
    }

    let options = {
      where: condition,
      include: [
        {
          model: db.Customer,
          attributes: {
            exclude: ["createdAt", "updatedAt", "refresh_token", "password"],
          },
        },
        { model: db.Calendar, include: { model: db.Tour } },
      ],

      limit: limit ? parseInt(limit) : undefined,
      offset: limit && page ? parseInt(offset) : undefined,
    };

    if (sortcreatedAt) {
      options.order = [["createdAt", sortcreatedAt]];
    }

    const data = await db.BookingTour.findAndCountAll(options);

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

const createCancelBooking = async (rawData) => {
  const { id, date_cancel_booking, reason_cancel_booking } = rawData;

  try {
    const booking = await db.BookingTour.findByPk(id, { raw: true });

    if (!booking) {
      return {
        EM: "Tour đặt không tồn tại",
        EC: -2,
        DT: [],
      };
    }

    const condition = {};

    if (date_cancel_booking) {
      condition.date_cancel_booking = date_cancel_booking;
    }
    if (reason_cancel_booking) {
      condition.reason_cancel_booking = reason_cancel_booking;
    }

    condition.cancel_booking = 1;
    condition.status = "ĐÃ HỦY";

    const data = await db.BookingTour.update(condition, {
      where: {
        id: id,
      },
    });

    return {
      EM: "Hủy tour thành công ",
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

const createBooking = async (rawData) => {
  const {
    ID_Calendar,
    ID_Customer,
    ID_Voucher,
    numberTicketAdult,
    numberTicketChild,
  } = rawData;

  try {
    const Calendar = await db.Calendar.findByPk(ID_Calendar, { raw: true });
    const Customer = await db.Customer.findByPk(ID_Customer, { raw: true });

    if (!Customer) {
      return {
        EM: "Khách hàng không tồn tại",
        EC: -2,
        DT: [],
      };
    }

    if (!Calendar) {
      return {
        EM: "Lịch tour không tồn tại",
        EC: -2,
        DT: [],
      };
    }

    let tongveCon = await remainingSeats(ID_Calendar);
    let tongVeDat = +numberTicketAdult + +numberTicketChild;

    if (tongVeDat > tongveCon) {
      return {
        EM: "Hết chỗ !!!",
        EC: -2,
        DT: [],
      };
    }

    const condition = {};
    if (ID_Calendar) {
      condition.ID_Calendar = ID_Calendar;
    }
    if (ID_Customer) {
      condition.ID_Customer = ID_Customer;
    }
    if (ID_Voucher) {
      condition.ID_Voucher = ID_Voucher;
    }
    if (numberTicketAdult) {
      condition.numberTicketAdult = numberTicketAdult;
    }
    if (numberTicketChild) {
      condition.numberTicketChild = numberTicketChild;
    }

    //========================= Số tiền phải trả =============================

    const soTienPhaiTraTruocVoucher = await prepareTheBill(
      numberTicketChild,
      numberTicketAdult,
      Calendar?.priceChild,
      Calendar?.priceAdult
    );

    // Kiểm tra và tính tiền theo voucher nếu có
    let soTienPhaiTraSauVoucher = soTienPhaiTraTruocVoucher;
    if (ID_Voucher) {
      const Voucher = await db.Voucher.findByPk(ID_Voucher, { raw: true });
      if (Voucher) {
        // Xử lý logic tính tiền sau khi áp dụng voucher
        soTienPhaiTraSauVoucher = await applyVoucher(
          soTienPhaiTraTruocVoucher,
          Voucher
        );
        if (soTienPhaiTraSauVoucher == 0) {
          return {
            EM: "Mã voucher đã hết hạn",
            EC: -2,
            DT: [],
          };
        }
      } else {
        return {
          EM: "Mã voucher không tồn tại",
          EC: -2,
          DT: [],
        };
      }
    }

    condition.total_money = soTienPhaiTraSauVoucher;
    condition.paid_money = 0;
    condition.remaining_money = soTienPhaiTraSauVoucher;
    condition.cancel_booking = "0";
    condition.payment_method = "TẠI QUẦY";
    condition.payment_status = "CHƯA THANH TOÁN";
    condition.status = "CHỜ XÁC NHẬN";
    const data = await db.BookingTour.create(condition);

    return {
      EM: "Đặt tour thành công ",
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

const createBookingVNPAY = async (rawData) => {
  const {
    ID_Calendar,
    ID_Customer,
    ID_Voucher,
    numberTicketAdult,
    numberTicketChild,
    user,
  } = rawData;

  console.log("rawData", rawData);

  try {
    const Customer = await db.Customer.findByPk(ID_Customer, {
      raw: true,
      nest: true,
    });

    if (!Customer) {
      return {
        EM: "Khách hàng không tồn tại",
        EC: -2,
        DT: [],
      };
    }

    await db.Customer.update(
      { username: user.username, phone: user.phone },
      { where: { id: ID_Customer } }
    );

    const Calendar = await db.Calendar.findByPk(ID_Calendar, {
      raw: true,
      nest: true,
      include: [
        {
          model: db.Tour,
        },
      ],
    });

    if (!Calendar) {
      return {
        EM: "Lịch tour không tồn tại",
        EC: -2,
        DT: [],
      };
    }

    let tongveCon = await remainingSeats(ID_Calendar);
    let tongVeDat = +numberTicketAdult + +numberTicketChild;

    if (tongVeDat > tongveCon) {
      return {
        EM: "Hết chỗ !!!",
        EC: -2,
        DT: [],
      };
    }

    const condition = {};
    if (ID_Calendar) {
      condition.ID_Calendar = ID_Calendar;
    }
    if (ID_Customer) {
      condition.ID_Customer = ID_Customer;
    }
    if (ID_Voucher) {
      condition.ID_Voucher = ID_Voucher;
    }
    if (numberTicketAdult) {
      condition.numberTicketAdult = numberTicketAdult;
    }
    if (numberTicketChild) {
      condition.numberTicketChild = numberTicketChild || 0;
    }

    //========================= Số tiền phải trả =============================

    const soTienPhaiTraTruocVoucher = await prepareTheBill(
      numberTicketChild,
      numberTicketAdult,
      Calendar?.priceChild,
      Calendar?.priceAdult
    );

    // Kiểm tra và tính tiền theo voucher nếu có
    let soTienPhaiTraSauVoucher = soTienPhaiTraTruocVoucher;
    if (ID_Voucher) {
      const Voucher = await db.Voucher.findByPk(ID_Voucher, { raw: true });
      if (Voucher) {
        // Xử lý logic tính tiền sau khi áp dụng voucher
        soTienPhaiTraSauVoucher = await applyVoucher(
          soTienPhaiTraTruocVoucher,
          Voucher
        );
        if (soTienPhaiTraSauVoucher == 0) {
          return {
            EM: "Mã voucher đã hết hạn",
            EC: -2,
            DT: [],
          };
        }

        // cập nhập voucher đã dùng
        await db.VoucherUser.update(
          {
            status: 1,
          },
          {
            where: {
              id: ID_Voucher,
              ID_Customer: ID_Customer,
            },
          }
        );
      } else {
        return {
          EM: "Mã voucher không tồn tại",
          EC: -2,
          DT: [],
        };
      }
    }

    //========================= Số tiền đã thanh toán =============================

    condition.total_money = soTienPhaiTraSauVoucher;
    condition.paid_money = soTienPhaiTraSauVoucher;
    condition.remaining_money = 0;
    condition.cancel_booking = "0";
    condition.payment_method = "ONLINE";
    condition.payment_status = "CHƯA THANH TOÁN";
    condition.status = "ĐÃ DUYỆT";

    let data = await db.BookingTour.create(condition);

    const plainData = data.get({ plain: true });
    plainData.ID_Tour = Calendar?.ID_Tour;

    return {
      EM: "Đặt tour thành công ",
      EC: 0,
      DT: plainData,
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

// HỦY TOUR
const readAllFailBooking = async (rawData) => {
  try {
    const { page, limit } = rawData;

    let offset = (page - 1) * +limit;

    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() + 5);

    // Lọc những lịch trước ngày đi 5 ngày
    const CalendarBefore5Day = await db.Calendar.findAndCountAll({
      raw: true,
      nest: true,
      where: {
        startDay: {
          [Op.lt]: fiveDaysAgo,
        },
        status: "1",
      },
    });

    const resultTest = CalendarBefore5Day?.rows?.map(async (calendar) => {
      const booking = await db.BookingTour.findAndCountAll({
        raw: true,
        nest: true,
        where: {
          ID_Calendar: calendar?.id,
        },
        include: [
          {
            model: db.Customer,
            raw: true,
            nest: true,
            attributes: {
              exclude: ["createdAt", "updatedAt", "refresh_token", "password"],
            },
          },
        ],
      });

      return {
        ...calendar,
        booking: booking,
      };
    });

    const resultTestPromist = await Promise.all(resultTest);

    const resultTestPromiseFilter = resultTestPromist.filter((calendar) => {
      return calendar?.booking?.count >= 0;
    });

    const resultTestPromiseFilterLessThan10Ticket =
      resultTestPromiseFilter.filter((calendar) => {
        const totalTickets = +calendar?.booking?.rows?.reduce((total, item) => {
          return (total += item?.numberTicketAdult + item?.numberTicketChild);
        }, 0);

        calendar.totalTickets = totalTickets;

        return totalTickets < 10;
      });

    const a = {};
    resultTestPromiseFilterLessThan10Ticket.forEach((item) => {
      const ID_Tour = item?.ID_Tour;
      if (Object.keys(a).includes(ID_Tour.toString())) {
        a[ID_Tour].push(item);
      } else {
        a[ID_Tour] = [item];
      }
    });

    const arrayID_tour = Object.keys(a);
    const arrayTour = arrayID_tour.map(async (idTour) => {
      const tour = await db.Tour.findOne({
        raw: true,
        nest: true,
        where: {
          id: idTour,
        },
      });
      return {
        ...tour,
        calendarFail: a[idTour],
      };
    });
    const arrayTourPromist = await Promise.all(arrayTour);

    return {
      EM: "Lấy dữ liệu thành công ",
      EC: 0,
      DT: arrayTourPromist,
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

const cancelCalendarandNotificationBooking = async (rawData) => {
  const { booking, notification } = rawData;

  try {
    //
    const ID_Calendar = rawData?.id;

    if (booking?.count == 0) {
      await db.Calendar.update(
        { status: "0" },
        {
          where: {
            id: ID_Calendar,
          },
        }
      );
      return {
        EM: "Cập nhật lịch tour thành công ",
        EC: 0,
        DT: [],
      };
    }

    const arr_IDBookingTour = booking?.rows?.map((booking) => {
      return {
        ID_IDBookingTour: booking?.id,
      };
    });
    const arr_IDCustomer = booking?.rows?.map((customer) => {
      return {
        ID_Customer: customer?.ID_Customer,
      };
    });

    await db.Calendar.update(
      { status: "0" },
      {
        where: {
          id: ID_Calendar,
        },
      }
    );

    const promisesUpdateBookingTour = arr_IDBookingTour.map(async (item) => {
      return db.BookingTour.update(
        {
          status: "ĐÃ HỦY",
          payment_status: "HOÀN TIỀN",
          cancel_booking: "1",
          date_cancel_booking: new Date(),
          reason_cancel_booking: "Không đủ người cho lịch tour",
        },
        {
          where: {
            id: item?.ID_IDBookingTour,
          },
        }
      );
    });
    await Promise.all(promisesUpdateBookingTour);

    const promisesNotification = arr_IDCustomer.map(async (item) => {
      return db.Notification.create({
        ID_Customer: item.ID_Customer,
        ID_Calendar: ID_Calendar,
        title: "THÔNG BÁO HỦY TOUR",
        contentHTML: notification?.reason_TEXT,
        contentTEXT: notification?.reason_HTML,
        read: "0",
      });
    });
    // Chờ tất cả các promise được giải quyết
    await Promise.all(promisesNotification);

    return {
      EM: "Gửi yêu cầu hủy tour và thông báo cho khách hàng thành công ",
      EC: 0,
      DT: [],
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

export default {
  createBooking,
  updateBooking,
  readBooking,
  readAllBooking,
  createCancelBooking,
  createBookingVNPAY,
  updatePaid,
  readAllFailBooking,
  cancelCalendarandNotificationBooking,
};

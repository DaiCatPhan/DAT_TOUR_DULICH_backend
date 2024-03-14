import db from "../app/models";
const { Op } = require("sequelize");

// Đêm coi cái lịch đó có bao nhiều người đặt rồi ???? thêm điều kiện là != trạng thái đã hủy
const countBookingTourByIdCalendar = async (ID_Calendar) => {
  try {
    const calendars = await db.BookingTour.findAll({
      where: {
        ID_Calendar: ID_Calendar,
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
  console.log("countBookingByCalendar", countBookingByCalendar);
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
    if (
      currentDate < new Date(voucher.fromDate) ||
      currentDate > new Date(voucher.toDate)
    ) {
      throw new Error("Voucher đã hết hạn");
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

const createBooking = async (rawData) => {
  const {
    ID_Calendar,
    ID_Customer,
    ID_Voucher,
    numberTicketAdult,
    numberTicketChild,
    total_money,
    remaining_money,
    payment_status,
    status,
    cancel_booking,
    date_cancel_booking,
    reason_cancel_booking,
  } = rawData;

  try {
    const Calendar = await db.Calendar.findByPk(ID_Calendar, { raw: true });
    const Customer = await db.Calendar.findByPk(ID_Customer, { raw: true });

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

    console.log("tongveCon", tongveCon);
    console.log("tongVeDat", tongVeDat);

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
    if (payment_status) {
      condition.payment_status = payment_status;
    }

    //========================= Số tiền phải trả =============================

    const soTienPhaiTra = await prepareTheBill(
      numberTicketChild,
      numberTicketAdult,
      Calendar?.priceChild,
      Calendar?.priceAdult
    );

    // Kiểm tra và tính tiền theo voucher nếu có
    let soTienPhaiTraSauVoucher = soTienPhaiTra;
    if (ID_Voucher) {
      const Voucher = await db.Voucher.findByPk(ID_Voucher, { raw: true });
      if (Voucher) {
        // Xử lý logic tính tiền sau khi áp dụng voucher
        soTienPhaiTraSauVoucher = await applyVoucher(soTienPhaiTra, Voucher);
      } else {
        return {
          EM: "Mã voucher không hợp lệ",
          EC: -2,
          DT: [],
        };
      }
    }

    //========================= Số tiền đã thanh toán =============================

    // Số tiền đã thanh toán
    let soTienDaThanhToan = 0;
    // Xử lý phương thức thanh toán
    if (payment_method === "online") {
      // Trường hợp thanh toán online
      soTienDaThanhToan = total_money; // Số tiền đã thanh toán bằng tổng số tiền phải trả
    } else if (payment_method === "tại quầy") {
      // Trường hợp thanh toán tại quầy
      // Trong trường hợp này, giả sử người dùng đã thanh toán một phần nào đó trước đó
      // Bạn có thể cung cấp một cơ chế nào đó để nhập số tiền đã thanh toán từ quầy vào hệ thống
      // Ở đây tôi giả định sẽ có một trường hợp thực hiện thanh toán tại quầy trước đó và lưu vào remaining_money
      // Bạn có thể thay đổi cách xử lý tùy theo nhu cầu thực tế của ứng dụng
      soTienDaThanhToan = 0;
    }

    //========================= Số tiền còn lại phải thanh toán =============================

    const soTienConLaiPhaiThanhToan = soTienPhaiTra - soTienDaThanhToan;

    condition.total_money = soTienPhaiTraSauVoucher;
    condition.paid_money = soTienDaThanhToan;
    condition.remaining_money = soTienConLaiPhaiThanhToan;

    console.log("soTienPhaiTra", soTienPhaiTra);
    console.log("soTienDaThanhToan", soTienDaThanhToan);
    console.log("soTienConLaiPhaiThanhToan", soTienConLaiPhaiThanhToan);

    // const data = await db.BookingTour.create(condition);

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

const updateBooking = async (rawData) => {
  const {
    ID_Calendar,
    ID_Customer,
    ID_Voucher,
    numberTicketAdult,
    numberTicketChild,
    total_money,
    remaining_money,
    payment_status,
    status,
    cancel_booking,
    date_cancel_booking,
    reason_cancel_booking,
  } = rawData;

  try {
    const Calendar = await db.Calendar.findByPk(ID_Calendar);
    const Customer = await db.Calendar.findByPk(ID_Customer);

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

    // Kiểm tra chỗ ngồi
    let tongveCon = await remainingSeats(ID_Calendar);
    let tongVeDat = numberTicketAdult + numberTicketChild;

    if (tongVeDat > tongveCon) {
      return {
        EM: "Hết chỗ !!!",
        EC: 2,
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
    if (payment_status) {
      condition.payment_status = payment_status;
    }

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

export default { createBooking, updateBooking };

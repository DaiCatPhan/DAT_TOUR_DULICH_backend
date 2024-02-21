import db from "../app/models";

// DESTINATION
const createViewedTour = async (rawData) => {
  try {
    const { ID_Customer, ID_Tour } = rawData;

    const exitTourViewed = await db.ViewedTour.findOne({
      where: {
        ID_Customer: ID_Customer,
        ID_Tour: ID_Tour,
      },
    });

    if (exitTourViewed) {
      return {
        EM: "Tour đã lưu",
        EC: -2,
        DT: [],
      };
    }

    const createViewed = await db.ViewedTour.create({
      ID_Customer: +ID_Customer,
      ID_Tour: +ID_Tour,
    });

    return {
      EM: "Tạo tour đã xem thành công",
      EC: 0,
      DT: createViewed,
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

const readsViewed = async (rawData) => {
  const { ID_Customer } = rawData;
  try {
    // const exitCustomer = await db.Customer.findByPk(ID_Customer);
    // if (!exitCustomer) {
    //   return {
    //     EM: "Khách hàng không tồn tại !!!",
    //     EC: -2,
    //     DT: [],
    //   };
    // }
    let dataViewed = await db.ViewedTour.findAll({
      where: {
        ID_Customer: +ID_Customer,
      },
      include: [
        {
          model: db.Customer,
        },
        {
          model: db.Tour,
        },
      ],

      raw: true,
      nest: true,
    });

    return {
      EM: "Lấy dữ liệu thành công ",
      EC: 0,
      DT: dataViewed,
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

export default { createViewedTour, readsViewed };

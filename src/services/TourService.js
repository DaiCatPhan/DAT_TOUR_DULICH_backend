import db from "../app/models";

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
    address,
    domain,
    priceAdult,
    priceChild,
    price_Include,
    price_NotInclude,
    duration,

    vehicle,
  } = rawData;
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
      address: address,
      domain: domain,
      priceAdult: priceAdult,
      priceChild: priceChild,
      price_Include: price_Include,
      price_NotInclude: price_NotInclude,
      duration: duration,
      vehicle: vehicle,
    });

    if (data) {
      return {
        EM: "Tạo Tour thành công ",
        EC: 0,
        DT: data,
      };
    } else {
      return {
        EM: "Tạo Tour thất bại ",
        EC: -1,
        DT: data,
      };
    }
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: "Loi server !!!",
      EC: -2,
      DT: "",
    };
  }
};

const UpImageTour = async (rawData) => {
  const { ID_Tour, imageUrl } = rawData;

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
      image: imageUrl,
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
      EC: -2,
      DT: "",
    };
  }
};

export default { createTour, UpImageTour };

import db from "../app/models";

 

// DESTINATION
const createDestinationTour = async (rawData) => {
  try {
    const { ID_ProcessTour, name } = rawData;

    const createProcess = await db.Destination.create({
      ID_ProcessTour: +ID_ProcessTour,
      name: name,
    });

    return {
      EM: "Tạo điếm tham quan thành công",
      EC: 0,
      DT: createProcess,
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

export default {   createDestinationTour };

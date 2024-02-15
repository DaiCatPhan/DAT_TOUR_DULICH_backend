import db from "../app/models";

const createProcessTour = async (rawData) => {
  try {
    const { ID_Tour, descriptionHTML, descriptionTEXT } = rawData;

    const exitsTour = await db.Tour.findOne({
      where: {
        id: ID_Tour,
      },
    });

    const exitsPro = await db.ProcessTour.findOne({
      where: {
        ID_Tour: ID_Tour,
      },
    });

    if (!exitsTour) {
      return {
        EM: "Tour không tồn tại !!!",
        EC: -2,
        DT: [],
      };
    }

    if (exitsPro) {
      return {
        EM: "Chương trình Tour đã tồn tại !!! , Không thể tạo mới",
        EC: -2,
        DT: [],
      };
    }

    const createProcess = await db.ProcessTour.create({
      ID_Tour: ID_Tour,
      descriptionHTML: descriptionHTML,
      descriptionTEXT: descriptionTEXT,
    });

    if (createProcess) {
      return {
        EM: "Tạo chương trình Tour thành công",
        EC: 0,
        DT: createProcess,
      };
    }
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: "Loi server !!!",
      EC: -5,
      DT: [],
    };
  }
};

const updateProcessTour = async (rawData) => {
  try {
    const { ID_Tour, idProcessTour, descriptionHTML, descriptionTEXT } =
      rawData;

    const isExitsProcessTour = await db.ProcessTour.findByPk(idProcessTour);
    const isExitsTour = await db.Tour.findByPk(ID_Tour);
    if (!isExitsTour) {
      return {
        EM: "  Tour không tồn tại !!!  ",
        EC: -1,
        DT: [],
      };
    }

    if (!isExitsProcessTour) {
      const createProcess = await db.ProcessTour.create({
        ID_Tour: ID_Tour,
        descriptionHTML: descriptionHTML,
        descriptionTEXT: descriptionTEXT,
      });
      return {
        EM: "Tạo chương trình Tour thành công  ",
        EC: 0,
        DT: createProcess,
      };
    }

    const updateProcess = await db.ProcessTour.update(
      {
        descriptionHTML: descriptionHTML,
        descriptionTEXT: descriptionTEXT,
      },
      {
        where: {
          id: +idProcessTour,
          ID_Tour: +ID_Tour,
        },
      }
    );

    return {
      EM: "Cập nhật chương trình Tour thành công",
      EC: 0,
      DT: updateProcess,
    };
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: "Loi server !!!",
      EC: 0,
      DT: [],
    };
  }
};

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

export default { createProcessTour, updateProcessTour, createDestinationTour };

import CalendarService from "../services/CalendarService";

class Calendar {
  async create(req, res) {
    try {
      const {
        ID_Tour,
        numberSeat,
        startDay,
        endDay,
        priceAdult,
        priceChild,
        status,
      } = req.body;

      if (
        !ID_Tour ||
        !numberSeat ||
        !startDay ||
        !endDay ||
        !priceAdult ||
        !priceChild
      ) {
        return res.status(200).json({
          EM: "Nhập thiếu trường dữ liệu !!!",
          EC: -2,
          DT: [],
        });
      }
      const data = await CalendarService.createCalender(req.body);

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server", // error message
        EC: -5, // error code
        DT: [], // data
      });
    }
  }

  async createWithMonth(req, res) {
    try {
      const {
        ID_Tour,
        numberSeat,
        startDay,
        endDay,
        priceAdult,
        priceChild,
        status,
        numberMonth,
      } = req.body;

      if (
        !ID_Tour ||
        !numberSeat ||
        !startDay ||
        !endDay ||
        !priceAdult ||
        !priceChild
      ) {
        return res.status(200).json({
          EM: "Nhập thiếu trường dữ liệu !!!",
          EC: -2,
          DT: [],
        });
      }
      const data = await CalendarService.createWithMonth(req.body);

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server", // error message
        EC: -5, // error code
        DT: [], // data
      });
    }
  }

  async update(req, res) {
    try {
      const {
        ID_Calendar,
        ID_Tour,
        numberSeat,
        startDay,
        endDay,
        priceAdult,
        priceChild,
        status,
      } = req.body;

      if (!ID_Calendar || !numberSeat || !priceAdult || !priceChild) {
        return res.status(200).json({
          EM: "Nhập thiếu trường dữ liệu !!!",
          EC: -2,
          DT: [],
        });
      }
      const data = await CalendarService.updateCalendar(req.body);

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server", // error message
        EC: -5, // error code
        DT: [], // data
      });
    }
  }

  async deleted(req, res) {
    try {
      const { ID_Calendar } = req.body;

      if (!ID_Calendar) {
        return res.status(200).json({
          EM: "Nhập thiếu trường dữ liệu !!!",
          EC: -2,
          DT: [],
        });
      }
      const data = await CalendarService.deleted(req.body);

      return res.status(200).json({ 
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server", // error message
        EC: -5, // error code
        DT: [], // data
      });
    }
  }
}

export default new Calendar();

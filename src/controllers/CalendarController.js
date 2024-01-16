import CalendarService from "../services/CalendarService";

class Calendar {
  
  async create(req, res) {
    try {
      const { ID_Tour, numberSeat, startDay, endDay, priceAdult, priceChild } =
        req.body;

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
        EC: "-1", // error code
        DT: "", // data
      });
    }
  }

  update(req, res) {
    return res.json("update");
  }
}

export default new Calendar();

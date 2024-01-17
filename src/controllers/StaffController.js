import StaffService from "../services/StaffService";

class Staff {
  // [POST] /api/v1/staff/create
  async create(req, res) {
    try {
      const { username, email, role, address, phone, password } = req.body;

      // check điều kiện :
      if (!username || !role || !email || !address || !password || !phone) {
        return {
          EM: "Nhập thiếu dữ liệu",
          EC: -2,
          DT: [],
        };
      }

      const data = await StaffService.createNewUser(req.body);
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

  // [PUT] /api/v1/staff/update
  async update(req, res) {
    try {
      let { id, username, email, role, address, phone , status } = req.body;

      if (!id || !username || !email || !role || !address || !phone || !status) {
        return res.status(200).json({
          EM: "Nhập thiếu dữ liệu !!!",
          EC: -2,
          DT: [],
        });
      }

      const data = await StaffService.updateStaff(req.body);

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


  
}

export default new Staff();

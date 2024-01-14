import BookingSerivce from "../services/BookingSerivce";

class Tour {
  create(req, res) {
    res.json("create Tour");
  }
  read(req, res) {
    res.json("read Tour");
  }
  update(req, res) {
    res.json("update Tour");
  }
  delete(req, res) {
    res.json("delete Tour");
  }
}

export default new Tour();

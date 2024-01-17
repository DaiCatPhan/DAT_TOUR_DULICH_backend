import CustomerService from "../services/CustomerService";

class Customer {
  // [POST] /api/v1/customer/create
  create(req, res) {
    res.json("CustomerService");
  }
}

export default new Customer();

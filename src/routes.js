const express = require("express");
const router = express.Router();
const service = require("./controllers/customer.controller");
const auth = require('./middlewares/authentication');

module.exports = function () {
  router.post("/create", service.createCustomer);
  router.post('/login', service.loginCustomer);
  router.get('/customer/', service.getCustomerInfo);
  router.get('/viewall', service.getAllCustomers);
  router.get('/view/:id', service.getCustomerById);
  router.put('/update/:id', service.updateCustomer);
  router.delete("/delete/:id", service.deleteCustomer);

  return router;
};
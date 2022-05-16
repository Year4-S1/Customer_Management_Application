const Customer = require('../models/Customer');
const enums = require('./controller.enums') ;
const  responseHandler = require('../response/response-handler') ;
const response  = require('express');
const LOG = require('./controller.log');

const  createCustomer = async (req, res) => {
  if (req.body) {
    const customer = new Customer(req.body);
    await customer
      .save()
      .then((data) => {
        res.status(200).send({ data: data });
        LOG.info(enums.customer.CREATE_SUCCESS);
      })
      .catch((error) => {
        res.status(500).send({ error: error.message });
        LOG.info(enums.customer.CREATE_ERROR);
      });
  }
}

//Customer login
const loginCustomer = async (req, res) => {
  if (req.body && req.body.userName && req.body.password) {
    let { userName, password } = req.body;

    new Promise(async (resolve, reject) => {
      try {
        let customer = await Customer.findByUsernamePassword(userName, password);

        if (!customer) {
          throw new Error(enums.customer.NOT_FOUND);
        }

        const TOKEN = await customer.generateAuthToken();
        let responseData = {
          user_id: customer._id,
          userName: customer.userName,
          token: TOKEN,
          role: customer.role,
        };
        return resolve({ responseData });
      } catch (error) {
        return resolve(error.message);
      }
    })
      .then((data) => {
        if (data === enums.customer.NOT_FOUND) {
          LOG.warn(enums.customer.NOT_FOUND);
        } else if (data === enums.customer.PASSWORD_NOT_MATCH) {
          LOG.warn(enums.customer.PASSWORD_NOT_MATCH);
        } else {
          LOG.info(enums.customer.LOGIN_SUCCESS);
        }
        responseHandler.respond(res, data);
      })
      .catch((error) => {
        LOG.info(enums.customer.LOGIN_ERROR);
        responseHandler.handleError(res, error.message);
      });
  } else {
    return responseHandler.handleError(res, enums.customer.CREDENTIAL_REQUIRED);
  }
}

//get customer information
const getCustomerInfo = async (req, res) => {
  const customer = req.customer;

  if (customer) {
    const customerObject = {
      _id: req.customer._id,
      firstName: req.customer.firstName,
      lastName: req.customer.lastName,
      email: req.customer.email,
      phoneNumber: req.customer.phoneNumber,
      addressLine: req.customer.addressLine,
      userName: req.customer.userName,
    };

    responseHandler.respond(res, customerObject);
  } else {
    responseHandler.notFound(res);
  }
}

//Get all customers
const getAllCustomers = async (req, res) => {
  await Customer.find({})
    .then((customers) => {
      res.status(200).json(customers);
    })
    .catch((error) => {
      res.status(500).json(error.message);
    });
}

//get employee by id
const getCustomerById = async (req, res, next) =>{
  if (req.params && req.params.id) {
    await Customer.findById(req.params.id)
      .then((data) => {
        res.status(200).send({ data: data });
        LOG.info(enums.customer.VIEW_SUCCESS);
      })
      .catch((error) => {
        res.status(500).send({ error: error.message });
        LOG.info(enums.customer.VIEW_UNSUCCESS);
      });
  }
}

const updateCustomer = async (req, res) => {
  if (!req.is("application/json")) {
    res.send(400);
  } else {
    Customer.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
          userName: req.body.userName
        },
      },
      { upsert: true },
      function (err, result) {
        if (err) {
          res.status(500).send(body);
          LOG.info(enums.customer.NOT_FOUND);
        } else {
          res.status(200).send(result);
          LOG.info(enums.customer.UPDATE_SUCCESS);
        }
      }
    );
  }
};


//delete customer '/delete'
const deleteCustomer = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  //delete customer data from database
  await Customer.findByIdAndDelete(req.params.id)
    .then((response) => {
      res.status(200).send(response);
      LOG.info(enums.customer.DELETE_SUCCESS);
    })
    .catch((err) => {
      res.status(500).send(err.message);
      LOG.info(enums.customer.DELETE_ERROR);
    });
}

module.exports = {
  createCustomer,
  loginCustomer,
  getCustomerInfo,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
}
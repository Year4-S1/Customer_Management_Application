import Customer from '../models/Customer';
import enums from './controller.enums';
import responseHandler from '../response/response-handler';
import { response } from 'express';
import LOG from './controller.log';

export async function createCustomer(req, res) {
  if (req.body && req.body.userName) {
    new Promise(async (resolve, reject) => {
      let userName = req.body.userName;
      let customer = await Customer.findOne({ userName: userName });

      if (customer) {
        return resolve(enums.customer.ALREADY_EXIST);
      }

      customer = new Customer(req.body);
      await customer.save();
      const TOKEN = await customer.generateAuthToken();
      let responseData = {
        user_id: customer._id,
        userName: customer.userName,
        token: TOKEN,
        role: customer.role,
      };
      return resolve({ responseData, TOKEN });
    })
      .then((data) => {
        if (data === enums.customer.ALREADY_EXIST) {
          LOG.warn(enums.customer.ALREADY_EXIST);
        } else {
          LOG.info(enums.customer.CREATE_SUCCESS);
        }

        responseHandler.respond(res, data);
      })
      .catch((error) => {
        LOG.info(enums.user.CREATE_ERROR);
        responseHandler.handleError(res, error.message);
      });
  }
}

export async function loginCustomer(req, res) {
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

export async function getCustomerInfo(req, res) {
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
export async function getAllCustomers(req, res) {
  await Customer.find({})
    .then((customers) => {
      res.status(200).json(customers);
    })
    .catch((error) => {
      res.status(500).json(error.message);
    });
}

//get employee by id
export async function getCustomerById(req, res, next) {
  if (req.params && req.params.id) {
    await Customer.findById(req.params.id)
      .populate({
        path: 'customer',
        populate: {
          path: 'customer',
          model: 'customers',
          select:
            '_id firstname lastname address phone email username',
        },
      })
      .then((data) => {
        response.sendRespond(res, data);
        next();
      })
      .catch((error) => {
        response.sendRespond(res, error.message);
        next();
      });
  } else {
    response.sendRespond(res, enums.customer.NOT_FOUND);
    return;
  }
}

//delete customer '/delete'
export async function deleteCustomer(req, res) {
  if (req.params.id && req.customer) {
    try {
      new Promise(async (resolve, reject) => {
        let customer = await Customer.findById(req.params.id);

        if (!customer) {
          throw new Error(enums.NOT_FOUND);
        }
        customer = await Customer.findByIdAndDelete(req.params.id);
        return resolve({ customer });
      })
        .then((data) => {
          responseHandler.respond(res, data);
        })
        .catch((error) => {
          console.log(error);
          responseHandler.handleError(res, error.message);
        });
    } catch (error) {
      console.log(error);
      return responseHandler.handleError(res, error.message);
    }
  } else {
    return responseHandler.respond(res, enums.customer.NOT_FOUND);
  }
}
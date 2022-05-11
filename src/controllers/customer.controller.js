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
        user_id: user._id,
        userName: user.userName,
        token: TOKEN,
        role: user.role,
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
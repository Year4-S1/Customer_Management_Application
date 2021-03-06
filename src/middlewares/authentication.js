const jwt =  require('jsonwebtoken');
const Customer = require('../models/Customer');

module.exports = async function auth(req, res, next) {
  try {
    const TOKEN = req.header('Authorization');
    const DECODE = jwt.verify(TOKEN, 'customerapisecret');
    const customer = await Customer.findOne({ _id: DECODE._id, token: TOKEN });

    if (!customer) {
      throw new Error(
        'Error from auth middleware - Please authenticate to the system'
      );
    }
    req.token = TOKEN;
    req.customer = customer;
    next();
  } catch (error) {
    res.status(500).json(error.message);
  }
};
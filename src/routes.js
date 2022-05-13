import { loginCustomer, createCustomer, getCustomerInfo } from './controllers/customer.controller';
import auth from './middlewares/authentication';

export default function(app){
  //API endpoints of Customer 
  app.post('/customer/create',createCustomer);
  app.post('/customer/login', loginCustomer);
  app.get('/customer/',auth, getCustomerInfo);
}
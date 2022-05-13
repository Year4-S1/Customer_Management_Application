import { loginCustomer, createCustomer } from './controllers/customer.controller';

export default function(app){
  //API endpoints of Customer 
  app.post('/customer/create',createCustomer);
  app.post('/customer/login', loginCustomer);
}
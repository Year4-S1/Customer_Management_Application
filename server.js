const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const body_parser = require('body-parser');

import {
  DEVELOPMENT_PORT,
  DEVELOPMENT_MONGO_URI,
  PRODUCTION_PORT,
  PRODUCTION_MONGO_URI,
  LOCAL_MONGO_URI,
} from './config';
import LOG from './log';
import routes from './src/routes';

dotenv.config();
const app = express(); 
app.use(cors());
app.use(body_parser.json());

const PORT = process.env.PORT || 8089;
const MONGODB_URI = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (error) =>{
  if(error){
    console.log("Database error", error.message);
  }
});


mongoose.connection.once('open', () =>{
  console.log('Database Synced');
});

app.listen(PORT, () =>{
  console.log(`API is up and running on PORT ${PORT}`);
  routes(app);
});

app.route('/').get((req, res) => {
  res.send('CTSE Customer Management Application Backend: Microservices');
});
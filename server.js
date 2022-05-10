const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const body_parser = require('body-parser');

dotenv.config();
const app = express(); 
app.use(cors());
app.use(body_parser.json());

const PORT = process.env.PORT || 8089;
const MONGODB_URI = " "
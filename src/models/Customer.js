import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const CustomerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is Required'],
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Please enter valid email address');
        }
      },
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number required'],
      trim: true,
      max: [10, 'Please enter valid phone number'],
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error('Please enter valid mobile number');
        }
      },
    },
    addressLine: {
      type: String,
      required: [true, 'Address  is required'],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password must be provided'],
      trim: true,
    },
    token: { type: String },
  },
  {
    timestamps: true,
  }
);

CustomerSchema.pre('save', async function (next) {
  const customer = this;
  if (customer.isModified('password')) {
    customer.password = await bcrypt.hash(customer.password, 8);
  }
  next();
});

CustomerSchema.methods.generateAuthToken = async function () {
  const customer = this;
  const token = jwt.sign({ _id: customer._id }, 'customerapisecret');
  user.token = token;
  await user.save();
  return token;
};


CustomerSchema.statics.findByUsernamePassword = async function (
  userName,
  password
) {
  const customer = await Customer.findOne({ userName });
  if (!customer) {
    throw new Error('Customer not found');
  }
  const isMatch = await bcrypt.compare(password, customer.password);
  if (!isMatch) {
    throw new Error('Password is not matched');
  }
  return customer;
};

const Customer = mongoose.model('customers', CustomerSchema);

export default Customer;
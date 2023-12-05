const mongoose = require("mongoose");
const { Schema } = mongoose;

const customer = new Schema({
  first_name: String,
  last_name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
  phone: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  default_address: {
    type: Schema.Types.ObjectId,
    ref: "addresses",
    default: null,
  },
  default_payment: {
    type: Schema.Types.ObjectId,
    ref: "payments",
    default: null,
  },
});

const subscriber = new Schema({
  email: String,
});

module.exports = {
  customers: customer,
  subscribers: subscriber,
};

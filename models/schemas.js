const mongoose = require("mongoose");
const { Schema } = mongoose;

const customer = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
});

const subscriber = new Schema({
  email: String,
});

module.exports = {
  customers: customer,
  subscribers: subscriber,
};

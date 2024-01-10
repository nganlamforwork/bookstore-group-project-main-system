const { UUID } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const user = new Schema({
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
    default: null,
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
  socialId: {
    type: String,
    default: null,
  },
  provider: {
    type: String,
    default: "app",
  },
  role: {
    type: String,
    enum: ["customer", "admin", "superadmin"],
    default: "customer",
  },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

const address = new Schema({
  customer_id: {
    type: Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    default: null,
    required: true,
  },
  address: {
    type: String,
    default: null,
    required: true,
  },
  created_at: { type: Date, default: Date.now, required: true },
  last_updated: { type: Date, default: Date.now, required: true },
});
const subscriber = new Schema({
  email: String,
  created_at: { type: Date, default: Date.now },
});

const categories = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  thumbnail: String,
  created_at: { type: Date, default: Date.now, required: true },
  last_updated: { type: Date, default: Date.now, required: true },
});
const books = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  votes: Number,
  brief_des: String,
  full_des: { type: String, required: true },
  author_name: String,
  pages: Number,
  age: String,
  price: Number,
  vendor: String,
  language: String,
  published_at: { type: Date },
  thumbnail: String,
  inventory: Number,
  category_id: {
    type: Schema.Types.ObjectId,
    ref: "categories",
    default: null,
  },
  discount_id: {
    type: Schema.Types.ObjectId,
    ref: "discount_programs",
    default: null,
  },
  created_at: { type: Date, default: Date.now, required: true },
  last_updated: { type: Date, default: Date.now, required: true },
});

const carts = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "books",
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

const payment_balances = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  cardholderName: {
    type: String,
    // required: true,
  },
  cardNumber: {
    type: String,
    // required: true,
  },
  expires: {
    type: String,
    // required: true,
  },
  cvv: {
    type: String,
    // required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

const login = new Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  ip: { type: String, required: true },
  time: { type: Date, required: true },
  browser: { type: String },
  device: { type: String },
});

const order = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  subTotal: {
    type: Number,
    required: true,
  },
  defaultAddress: {
    type: Schema.Types.ObjectId,
    ref: "addresses",
    default: null,
  },
  products: [
    {
      bookId: {
        type: Schema.Types.ObjectId,
        ref: "books",
      },
      quantity: Number,
    },
  ],
  created_at: { type: Date, default: Date.now },
});

const payment_history = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  activity: {
    type: String,
  },
  date: { type: Date, default: Date.now },
  amount: {
    type: Number,
    required: true,
  },
  income: {
    type: Boolean,
  },
  success: {
    type: Boolean,
  },
});

module.exports = {
  users: user,
  subscribers: subscriber,
  categories: categories,
  books: books,
  addresses: address,
  carts: carts,
  payment_balances: payment_balances,
  login: login,
  orders: order,
  payment_history: payment_history,
};

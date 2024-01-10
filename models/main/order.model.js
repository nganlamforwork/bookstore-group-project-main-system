const db = require("../db");
const schema = "orders";

const OrderModel = {
  add: async (newOrder) => {
    try {
      await db.add(schema, newOrder);
    } catch (error) {
      console.error(error);
    }
  },
  get: async (email) => {
    try {
      const order = await db.get(schema, "email", email);
      return order;
    } catch (err) {
      console.error(err);
    }
  },
  getAll: async (customerId) => {
    try {
      const orders = await db.getAll(schema, "customerId", customerId);
      return orders;
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = OrderModel;

const db = require("../db");
const schema = "customers";

const CustomersModel = {
  add: async (data) => {
    try {
      await db.add(schema, data);
    } catch (error) {
      console.error(error);
    }
  },
  getAll: async () => {
    try {
      const customers = await db.getAll(schema);
      return customers;
    } catch (err) {
      console.error(err);
    }
  },
  getAllWithAddresses: async () => {
    try {
      const pipeline = [
        {
          $lookup: {
            from: "addresses",
            localField: "default_address",
            foreignField: "_id",
            as: "addressInfo",
          },
        },
        {
          $unwind: {
            path: "$addressInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      const customersWithAddresses = await db.aggregate(schema, pipeline);
      return customersWithAddresses;
    } catch (err) {
      console.error(err);
    }
  },
  getById: async (customerId) => {
    try {
      return await db.get(schema, "_id", customerId);
    } catch (error) {
      console.error(error);
    }
  },

  deleteById: async (customerId) => {
    try {
      return await db.deleteById(schema, customerId);
    } catch (error) {
      console.error(error);
    }
  },

  updateById: async (customerId, data) => {
    try {
      return await db.updateById(schema, customerId, data);
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = CustomersModel;

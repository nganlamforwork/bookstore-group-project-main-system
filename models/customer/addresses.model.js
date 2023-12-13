const db = require("../db");
const schema = "addresses";

const AddressModel = {
  getAll: async (customerId) => {
    try {
      const addresses = await db.getAll(schema, "customer_id", customerId);
      return addresses;
    } catch (err) {
      console.error(err);
    }
  },
  get: async (id) => {
    try {
      const address = await db.get(schema, "_id", id);
      return address;
    } catch (err) {
      console.error(err);
    }
  },
  add: async (data) => {
    try {
      return await db.add(schema, data);
    } catch (err) {
      console.error(err);
    }
  },
  addDefault: async (customer_id, address_id) => {
    try {
      return await db.update(schema, "_id", customer_id, {
        default_address: address_id,
      });
    } catch (err) {
      console.error(err);
    }
  },
  delete: async (customerId, addressId) => {
    try {
      return await db.deleteById(schema, addressId);
    } catch (err) {
      console.error(err);
    }
  },
  update: async (id, updateData) => {
    try {
      updateData.last_updated = new Date();
      const result = await db.update(schema, "_id", id, updateData);
      return result;
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = AddressModel;

const db = require("./db");
const schema = "customers";

const CustomerModel = {
  add: async (firstname, lastname, email, pw) => {
    try {
      const customer = await db.get(schema, "email", email);
      if (customer) {
        return {
          status: false,
          msg: `User with ${email} email is already exists`,
        };
      }
      await db.add(schema, {
        first_name: firstname,
        last_name: lastname,
        email: email,
        password: pw,
      });
      return { status: true, msg: `User create successfully` };
    } catch (err) {
      console.error(err);
    }
  },
  get: async (email) => {
    try {
      const customer = await db.get(schema, "email", email);
      return customer;
    } catch (err) {
      console.error(err);
    }
  },
  update: async (email, updateData) => {
    try {
      const result = await db.update(schema, "email", email, updateData);
      return result;
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = CustomerModel;

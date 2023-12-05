const db = require("./db");
const schema = "customers";

const CustomerModel = {
  add: async (firstname, lastname, email, pw) => {
    try {
      await db.add(schema, {
        first_name: firstname,
        last_name: lastname,
        email: email,
        password: pw,
      });
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
};

module.exports = CustomerModel;

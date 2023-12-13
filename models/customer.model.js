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
  addSocial: async (
    given_name,
    family_name,
    email,
    picture,
    provider,
    socialId
  ) => {
    try {
      await db.add(schema, {
        first_name: given_name,
        last_name: family_name,
        email: email,
        avatar: picture,
        provider: provider,
        socialId: socialId,
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
  getSocial: async (socialId) => {
    try {
      const customer = await db.get(schema, "socialId", socialId);
      return customer;
    } catch (err) {
      console.error(err);
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
  update: async (email, updateData) => {
    try {
      updateData.last_updated = new Date();
      const result = await db.update(schema, "email", email, updateData);
      return result;
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = CustomerModel;

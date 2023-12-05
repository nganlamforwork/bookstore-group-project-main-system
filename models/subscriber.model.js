const db = require("./db");

const schema = "subscribers";

const SubscriberModel = {
  add: async (email) => {
    try {
      await db.add(schema, {
        email: email,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = SubscriberModel;

const db = require("../db");
const { v4: uuidv4 } = require("uuid");

const CustomerModel = {
  add: async (firstname, lastname, email, pw) => {
    try {
      const customerId = uuidv4();
      await db.add(customerId, firstname, lastname, email, pw);
    } catch (err) {
      console.error(err);
    }
  },
  getUser: async (username) => {
    console.log("get user");
    // try {
    // 	const user = await db.oneOrNone(
    // 		'SELECT * FROM "Users" WHERE "Username" = $1',
    // 		[username]
    // 	);
    // 	return user;
    // } catch (err) {
    // 	console.log(err);
    // }
  },
};

module.exports = CustomerModel;

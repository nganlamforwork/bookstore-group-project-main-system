const mongoose = require("mongoose");

const uri = `mongodb+srv://admin:${process.env.DB_PW}@bookstore.s5hrnv5.mongodb.net/${process.env.DB_DB}?retryWrites=true&w=majority`;

const { Schema } = mongoose;

const customerSchema = new Schema({
  id: String,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
});

async function add(id, firstname, lastname, email, password) {
  try {
    await mongoose.connect(uri);

    const Customer = mongoose.model("customers", customerSchema);

    const doc = new Customer({
      id: id,
      first_name: firstname,
      last_name: lastname,
      email: email,
      password: password,
    });

    await doc.save();
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  add: add,
};

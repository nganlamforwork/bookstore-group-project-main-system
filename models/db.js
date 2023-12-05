const mongoose = require("mongoose");
const schemas = require("./schemas");

const uri = `mongodb+srv://admin:${process.env.DB_PW}@bookstore.s5hrnv5.mongodb.net/${process.env.DB_DB}?retryWrites=true&w=majority`;

async function add(schema, data) {
  try {
    await mongoose.connect(uri);

    if (!(schema in schemas)) {
      throw new Error(`Schema '${schema}' not found`);
    }

    const Model = mongoose.model(schema, schemas[schema]);

    const doc = new Model(data);

    await doc.save();
  } catch (error) {
    console.error(error);
  }
}
async function get(schema, fieldName, fieldValue) {
  try {
    await mongoose.connect(uri);

    if (!(schema in schemas)) {
      throw new Error(`Schema '${schema}' not found`);
    }

    const Model = mongoose.model(schema, schemas[schema]);

    const result = await Model.findOne({ [fieldName]: fieldValue });

    return result;
  } catch (error) {
    console.error(error);
  }
}
module.exports = {
  add: add,
  get: get,
};

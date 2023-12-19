const mongoose = require('mongoose');
const schemas = require('./schemas');
const { ObjectId } = mongoose.Types;

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
		return doc;
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
async function update(schema, fieldName, searchValue, updateData) {
	try {
		await mongoose.connect(uri);

		if (!(schema in schemas)) {
			throw new Error(`Schema '${schema}' not found`);
		}

		const Model = mongoose.model(schema, schemas[schema]);
		const result = await Model.updateOne(
			{ [fieldName]: searchValue },
			{ $set: updateData }
		);
		return result;
	} catch (error) {
		console.error(error);
	}
}

async function getAll(schema, fieldName = null, fieldValue = null) {
	try {
		await mongoose.connect(uri);

		if (!(schema in schemas)) {
			throw new Error(`Schema '${schema}' not found`);
		}

		const Model = mongoose.model(schema, schemas[schema]);

		if (fieldName && fieldValue) {
			const results = await Model.find({ [fieldName]: fieldValue });
			return results;
		} else {
			const results = await Model.find({});
			return results;
		}
	} catch (error) {
		console.error(error);
	}
}

async function deleteById(schema, id) {
	try {
		await mongoose.connect(uri);

		if (!(schema in schemas)) {
			throw new Error(`Schema '${schema}' not found`);
		}

		const Model = mongoose.model(schema, schemas[schema]);

		const result = await Model.deleteOne({ _id: id });

		return result;
	} catch (error) {
		console.error(error);
	}
}
async function deleteQuery(schema, criteria) {
	try {
		await mongoose.connect(uri);

		if (!(schema in schemas)) {
			throw new Error(`Schema '${schema}' not found`);
		}

		const Model = mongoose.model(schema, schemas[schema]);

		const result = await Model.deleteOne(criteria);

		return result;
	} catch (error) {
		console.error(error);
	}
}

async function aggregate(schema, pipeline) {
	try {
		await mongoose.connect(uri);

		if (!(schema in schemas)) {
			throw new Error(`Schema '${schema}' not found`);
		}

		const Model = mongoose.model(schema, schemas[schema]);

		const results = await Model.aggregate(pipeline);

		return results;
	} catch (error) {
		console.error(error);
	}
}
async function updateById(schema, id, updateData) {
	try {
		await mongoose.connect(uri);

		if (!(schema in schemas)) {
			throw new Error(`Schema '${schema}' not found`);
		}

		const Model = mongoose.model(schema, schemas[schema]);

		const result = await Model.updateOne({ _id: id }, { $set: updateData });

		return result;
	} catch (error) {
		console.error(error);
	}
}
async function getQuery(schema, query) {
	try {
		await mongoose.connect(uri);

		if (!(schema in schemas)) {
			throw new Error(`Schema '${schema}' not found`);
		}

		const Model = mongoose.model(schema, schemas[schema]);

		const result = await Model.findOne(query);

		return result;
	} catch (error) {
		console.error(error);
	}
}

module.exports = {
	add: add,
	get: get,
	getQuery: getQuery,
	update: update,
	getAll: getAll,
	deleteById: deleteById,
	deleteQuery: deleteQuery,
	aggregate: aggregate,
	updateById: updateById,
};

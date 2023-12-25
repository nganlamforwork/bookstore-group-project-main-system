const db = require('./db');
const schema = 'carts';

// function CartModel(initItems) {
// 	this.items = initItems || {};

// 	this.totalQty = 0;
// 	this.totalPrice = 0;

// 	if (this.items) {
// 		for (var key in this.items) {
// 			this.totalQty += this.items[key].qty;
// 			this.totalPrice += this.items[key].qty * this.items[key].item.price;
// 		}
// 	}

// 	this.add = async (item, quantity, id) => {
// 		var storedItem = this.items[id];
// 		if (!storedItem) {
// 			storedItem = this.items[id] = { qty: 0, item: item, price: 0 };
// 		}
// 		storedItem.qty += quantity; // Increment by the provided quantity
// 		storedItem.price = storedItem.item.price * storedItem.qty;
// 		this.totalQty += quantity; // Update total quantity
// 		this.totalPrice += storedItem.item.price * quantity; // Update total price
// 	};

// 	this.remove = function (id) {
// 		if (this.items[id]) {
// 			const storedItem = this.items[id];
// 			const removedQty = storedItem.qty;
// 			const removedPrice = storedItem.price;

// 			delete this.items[id]; // Remove the item from the cart

// 			// Update the total quantity and total price of the cart after removal
// 			this.totalQty -= removedQty;
// 			this.totalPrice -= removedPrice;
// 		}
// 	};

// 	this.get = function () {
// 		var arr = [];
// 		for (var id in this.items) {
// 			arr.push(this.items[id]);
// 		}
// 		return arr;
// 	};

// 	this.updateQuantity = function (id, newQuantity) {
// 		if (this.items[id]) {
// 			const storedItem = this.items[id];
// 			const prevQuantity = storedItem.qty;
// 			const diffQuantity = newQuantity - prevQuantity;

// 			storedItem.qty = newQuantity; // Update the quantity of the item
// 			storedItem.price = storedItem.item.price * newQuantity; // Update the price based on the new quantity

// 			// Update the total quantity and total price of the cart
// 			this.totalQty += diffQuantity;
// 			this.totalPrice += storedItem.item.price * diffQuantity;
// 		}
// 	};
// }

const CartModel = {
	addToCart: async (customerId, bookId, quantity) => {
		try {
			await db.add(schema, {
				customerId,
				bookId,
				quantity,
			});
		} catch (err) {
			console.error(err);
		}
	},
	getCartByCustomerId: async (customerId) => {
		try {
			const cart = await db.getAll(schema, 'customerId', customerId);
			return cart;
		} catch (err) {
			console.log(err);
		}
	},
	getCartItem: async (customerId, bookId) => {
		try {
			const bookInCart = await db.getQuery(schema, {
				customerId: customerId,
				bookId: bookId,
			});
			return bookInCart;
		} catch (err) {
			console.log(err);
		}
	},
	updateQuantity: async (cartId, updatedQuantity) => {
		try {
			const updateData = { quantity: updatedQuantity };
			const result = await db.update(schema, '_id', cartId, updateData);

			return result;
		} catch (err) {
			console.log(err);
		}
	},
	removeFromCart: async (customerId, bookId) => {
		try {
			const remainInCart = await db.deleteQuery(schema, {
				customerId,
				bookId,
			});
			return remainInCart;
		} catch (err) {
			console.log(err);
		}
	},
};

module.exports = CartModel;

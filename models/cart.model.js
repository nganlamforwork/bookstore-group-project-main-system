const db = require('./db');
const schema = 'carts';

function CartModel(initItems) {
	this.items = initItems || {};

	this.totalQty = 0;
	this.totalPrice = 0;

	if (this.items) {
		for (var key in this.items) {
			this.totalQty += this.items[key].qty;
			this.totalPrice += this.items[key].qty * this.items[key].item.price;
		}
	}

	this.add = function (item, quantity, id) {
		var storedItem = this.items[id];
		if (!storedItem) {
			storedItem = this.items[id] = { qty: 0, item: item, price: 0 };
		}
		storedItem.qty += quantity; // Increment by the provided quantity
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalQty += quantity; // Update total quantity
		this.totalPrice += storedItem.item.price * quantity; // Update total price
	};

	this.remove = function (id) {
		if (this.items[id]) {
			const storedItem = this.items[id];
			const removedQty = storedItem.qty;
			const removedPrice = storedItem.price;

			delete this.items[id]; // Remove the item from the cart

			// Update the total quantity and total price of the cart after removal
			this.totalQty -= removedQty;
			this.totalPrice -= removedPrice;
		}
	};

	this.get = function () {
		var arr = [];
		for (var id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	};

	this.updateQuantity = function (id, newQuantity) {
		if (this.items[id]) {
			const storedItem = this.items[id];
			const prevQuantity = storedItem.qty;
			const diffQuantity = newQuantity - prevQuantity;

			storedItem.qty = newQuantity; // Update the quantity of the item
			storedItem.price = storedItem.item.price * newQuantity; // Update the price based on the new quantity

			// Update the total quantity and total price of the cart
			this.totalQty += diffQuantity;
			this.totalPrice += storedItem.item.price * diffQuantity;
		}
	};
}

module.exports = CartModel;

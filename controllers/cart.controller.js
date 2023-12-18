const CartModel = require('../models/cart.model');
const BooksModel = require('../models/admin/books.model');
const moment = require('moment');

function convertStringToDate(books) {
	return books.map((book) => {
		if (book.item.published_at) {
			book.item.published_at = moment(book.item.published_at).format(
				'DD MMM YYYY'
			);
		}
		book.price = Number(book.price).toFixed(2);
		return book;
	});
}

const cartController = {
	show: async (req, res, next) => {
		try {
			if (!req.session.cart) {
				return res.render('customers/shopping-cart', {
					books: null,
				});
			}
			var cart = new CartModel(req.session.cart.items);
			const booksWithDate = convertStringToDate(cart.get());
			res.render('customers/shopping-cart', {
				books: booksWithDate,
				totalPrice: Number(cart.totalPrice).toFixed(2),
			});
		} catch (error) {
			next(error);
		}
	},
	addToCart: async (req, res, next) => {
		try {
			const bookId = req.params.id;
			const quantity = Number(req.query.quantity) || 1;
			const book = await BooksModel.getById(bookId);
			const cart = new CartModel(
				req.session.cart ? req.session.cart.items : {}
			);
			cart.add(book, quantity, book.id);
			req.session.cart = cart;
			console.log(req.session.cart);
			res.redirect('/cart');
		} catch (error) {
			next(error);
		}
	},
	updateCart: async (req, res, next) => {
		try {
			const bookId = req.params.id;
			const quantity = Number(req.query.quantity) || 1;
			const book = await BooksModel.getById(bookId);
			const cart = new CartModel(
				req.session.cart ? req.session.cart.items : {}
			);

			// Check if the book is already in the cart
			if (cart.items[book.id]) {
				// Update the quantity of the existing item in the cart
				cart.updateQuantity(book.id, quantity); // Implement this method in your CartModel
			} else {
				// If the book is not in the cart, add it
				cart.add(book, quantity, book.id);
			}

			req.session.cart = cart;
			console.log(req.session.cart);
			res.status(200).send({ message: 'Update cart successful' });
		} catch (error) {
			next(error);
		}
	},
	removeFromCart: async (req, res, next) => {
		try {
			const bookId = req.params.id;
			const cart = new CartModel(
				req.session.cart ? req.session.cart.items : {}
			);

			cart.remove(bookId);
			req.session.cart = cart;
			console.log(req.session.cart);
			res.redirect('/cart');
		} catch (error) {
			next(error);
		}
	},
};

module.exports = cartController;

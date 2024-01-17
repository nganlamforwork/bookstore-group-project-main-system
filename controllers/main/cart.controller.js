const CartModel = require('../../models/main/cart.model');
const BooksModel = require('../../models/admin/books.model');
const moment = require('moment');

const CartController = {
	displayCart: async (req, res, next) => {
		try {
			const user = req.session.user;
			if (!user) {
				return res.render('main/customers/shopping-cart', {
					books: null,
					unauthorized: true,
				});
			}
			const cart = await CartModel.getCartByCustomerId(user._id);
			// If cart is empty
			if (!cart) {
				return res.render('main/customers/shopping-cart', {
					books: null,
				});
			}
			let subTotal = 0;
			const cartInfo = await Promise.all(
				cart.map(async (item) => {
					try {
						const book = await BooksModel.getById(item.bookId);
						const modifiedBook = JSON.parse(JSON.stringify(book));
						if (book.published_at) {
							modifiedBook.published_at = moment(book.published_at).format(
								'DD MMM YYYY'
							);
						} else {
							modifiedBook.published_at = 'Not available';
						}

						const totalPrice = modifiedBook.price * item.quantity;
						subTotal += totalPrice;
						return {
							_id: item._doc._id,
							book: modifiedBook,
							totalPrice: Number(totalPrice).toFixed(2),
							quantity: item._doc.quantity,
						};
					} catch (error) {
						console.error(`Error fetching book details: ${error}`);
						return item;
					}
				})
			);
			req.session.cart = {
				...req.session.cart,
				cart: cartInfo,
				subTotal,
			};
			res.render('main/customers/shopping-cart', {
				books: cartInfo,
				subTotal: Number(subTotal).toFixed(2),
			});
		} catch (error) {
			next(error);
		}
	},
	addToCart: async (req, res, next) => {
		try {
			const bookId = req.params.id;
			const user = req.session.user;
			if (!user) {
				return res.redirect('/auth/login');
			}
			const quantity = Number(req.query.quantity) || 1;
			// Check if the book already exists in the user's cart
			const existingCartItem = await CartModel.getCartItem(user._id, bookId);
			if (existingCartItem) {
				// If the book already exists, update its quantity in the cart
				const updatedQuantity = existingCartItem.quantity + quantity;
				await CartModel.updateQuantity(existingCartItem._id, updatedQuantity);
			} else {
				// If the book doesn't exist, add it to the cart
				await CartModel.addToCart(user._id, bookId, quantity);
			}
			res.redirect('/');
		} catch (error) {
			next(error);
		}
	},
	updateQuantityInCart: async (req, res, next) => {
		try {
			const bookId = req.params.id;
			const updatedQuantity = Number(req.query.quantity) || 1;
			const user = req.session.user;
			const existingCartItem = await CartModel.getCartItem(user._id, bookId);
			if (existingCartItem) {
				// If the book already exists, update its quantity in the cart
				await CartModel.updateQuantity(existingCartItem._id, updatedQuantity);
			}
			const cart = await CartModel.getCartByCustomerId(user._id);
			const totalQuantity = cart.reduce(
				(total, item) => total + item.quantity,
				0
			);
			req.session.cart = {
				cart,
				totalQuantity,
			};

			res.redirect('/cart');
		} catch (error) {
			next(error);
		}
	},
	removeFromCart: async (req, res, next) => {
		try {
			const bookId = req.params.id;
			const user = req.session.user;
			await CartModel.removeFromCart(user._id, bookId);
			const remainInCart = await CartModel.getCartByCustomerId(user._id);
			const totalQuantity = remainInCart.reduce(
				(total, item) => total + item.quantity,
				0
			);
			req.session.cart = {
				remainInCart,
				totalQuantity,
			};
			res.redirect('/cart');
		} catch (error) {
			next(error);
		}
	},
};

module.exports = CartController;

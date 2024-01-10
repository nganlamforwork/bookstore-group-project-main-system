const AddressModel = require('../../models/main/profile/addresses.model');
const OrderModel = require('../../models/main/order.model');
const CardModel = require('../../models/payment/cards.model');
const CartModel = require('../../models/main/cart.model');
const PaymentHistoryModel = require('../../models/payment/history.model');
const BooksModel = require('../../models/admin/books.model');

const CheckoutController = {
	displayCheckout: async (req, res, next) => {
		try {
			const currentCart = req.session.cart.cart;
			const subTotal = req.session.cart.subTotal;
			const totalQuantity = req.session.cart.totalQuantity;
			const user = req.session.user;
			const defaultAddress = await AddressModel.get(user.default_address);

			res.render('main/customers/checkout', {
				title: 'Checkout',
				layout: 'main',
				user: user,
				subTotal: Number(subTotal).toFixed(2),
				totalQuantity: totalQuantity,
				books: currentCart,
				default_address: defaultAddress,
			});
		} catch (error) {
			next(error);
		}
	},
	newOrder: async (req, res, next) => {
		try {
			const user = req.session.user;
			const { subTotal, products } = req.body;
			const formattedProducts = products.map((prod) => {
				return {
					quantity: prod.quantity,
					bookId: prod.book._id,
				};
			});

			const cart = req.session.cart.cart;
			cart.map(async (c) => {
				const bookId = c.book._id;
				const quantity = c.quantity;
				const remainInInventory = c.book.inventory - quantity;
				await BooksModel.updateById(bookId, { inventory: remainInInventory });
			});

			const newOrder = {
				customerId: user._id,
				defaultAddress: user.default_address,
				subTotal: subTotal,
				products: formattedProducts,
			};

			const existingBalance = await CardModel.getBalance(user._id);
			const adminBalance = await CardModel.getAdminBalance();

			if (existingBalance) {
				const updatedAmount =
					parseInt(existingBalance.amount) - parseInt(subTotal);

				if (updatedAmount > 0) {
					await CardModel.updateBalance(existingBalance._id, updatedAmount);
					const updatedAdminAmount =
						parseInt(adminBalance.amount) + parseInt(subTotal);
					await CardModel.updateBalance(adminBalance._id, updatedAdminAmount);

					await OrderModel.add(newOrder);
					await CartModel.removeAll(user._id);

					// update cart
					req.session.cart = {};

					// update balance
					balance = await CardModel.getBalance(user._id);
					req.session.balance = balance;

					await PaymentHistoryModel.add({
						customerId: user._id,
						activity: 'Pay bookstore bill',
						amount: subTotal,
						income: false,
						success: true,
					});

					res.status(200).send({
						success: true,
						message: 'Thank you for purchasing our products!',
					});
				} else {
					await PaymentHistoryModel.add({
						customerId: user._id,
						activity: 'Pay bookstore bill',
						amount: subTotal,
						income: false,
						success: false,
					});
					res.status(400).send({
						success: false,
						message: 'Your balance is not enough, please recharge',
					});
				}
			}
		} catch (error) {
			next(error);
		}
	},
};

module.exports = CheckoutController;

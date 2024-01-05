const AddressModel = require('../models/customer/addresses.model');
const OrderModel = require('../models/order.model');
const BalanceModel = require('../models/balance.model');
const CartModel = require('../models/cart.model');

const checkoutController = {
	show: async (req, res, next) => {
		try {
			const currentCart = req.session.cart.cart;
			const subTotal = req.session.cart.subTotal;
			const totalQuantity = req.session.cart.totalQuantity;
			const user = req.session.user;
			const defaultAddress = await AddressModel.get(user.default_address);

			res.render('customers/checkout', {
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

			const newOrder = {
				customerId: user._id,
				defaultAddress: user.default_address,
				subTotal: subTotal,
				products: formattedProducts,
			};

			const existingBalance = await BalanceModel.getBalance(user._id);

			if (existingBalance) {
				const updatedAmount =
					parseInt(existingBalance.amount) - parseInt(subTotal);

				if (updatedAmount > 0) {
					await BalanceModel.updateBalance(
						existingBalance._id,
						updatedAmount
					);
					await OrderModel.add(newOrder);
					await CartModel.removeAll(user._id);

					// update cart
					req.session.cart = {};

					// update balance
					balance = await BalanceModel.getBalance(user._id);
					req.session.balance = balance;

					res.status(200).send({
						success: true,
						message: 'Thank you for purchasing our products!',
					});
				} else {
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

module.exports = checkoutController;

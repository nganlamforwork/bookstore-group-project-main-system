const checkoutController = {
	show: async (req, res, next) => {
		try {
			const currentCart = req.session.cart.cart;
			const subTotal = req.session.cart.subTotal;
			const totalQuantity = req.session.cart.totalQuantity;
			const user = req.session.user;
			console.log(
				'🚀 ~ file: checkout.controller.js:8 ~ show: ~ user:',
				user
			);

			res.render('customers/payments', {
				title: 'Checkout',
				layout: 'base',
                user: user,
				subTotal: Number(subTotal).toFixed(2),
				totalQuantity: totalQuantity,
				books: currentCart,
			});
		} catch (error) {
			next(error);
		}
	},
};

module.exports = checkoutController;

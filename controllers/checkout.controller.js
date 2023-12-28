const AddressModel = require("../models/customer/addresses.model");

const checkoutController = {
  show: async (req, res, next) => {
    try {
      const currentCart = req.session.cart.cart;
      const subTotal = req.session.cart.subTotal;
      const totalQuantity = req.session.cart.totalQuantity;
      const user = req.session.user;
      const defaultAddress = await AddressModel.get(user.default_address);
      console.log(
        "🚀 ~ file: checkout.controller.js:11 ~ show: ~ addresses:",
        defaultAddress
      );
      //   console.log("🚀 ~ file: checkout.controller.js:8 ~ show: ~ user:", user);

      res.render("customers/payments", {
        title: "Checkout",
        layout: "main",
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
};

module.exports = checkoutController;

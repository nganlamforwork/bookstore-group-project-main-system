const express = require("express");
const router = express.Router();
const CartController = require("../../controllers/main/cart.controller");

router.get("/", CartController.displayCart);
router.get("/add-to-cart/:id", CartController.addToCart);
router.get("/update-quantity-in-cart/:id", CartController.updateQuantityInCart);
router.get("/remove-from-cart/:id", CartController.removeFromCart);

module.exports = router;

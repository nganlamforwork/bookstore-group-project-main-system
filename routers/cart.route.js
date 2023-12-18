const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.get('/', cartController.show);
router.get('/add-to-cart/:id', cartController.addToCart);
router.get('/update-cart/:id', cartController.updateCart);
router.get('/remove-from-cart/:id', cartController.removeFromCart);

module.exports = router;

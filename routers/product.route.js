const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller.js');

router.get('/:id', productController.showBook);

module.exports = router;

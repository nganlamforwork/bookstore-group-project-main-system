const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller.js');

router.get('/:slug', categoryController.show);

module.exports = router;

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller.js');

router.get('/', categoryController.show);
router.post('/', categoryController.filter);

module.exports = router;

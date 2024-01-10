const express = require("express");
const router = express.Router();
const productController = require("../../controllers/main/product.controller.js");

router.get("/:id", productController.showBook);

module.exports = router;

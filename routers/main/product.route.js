const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/main/product.controller.js");

router.get("/:id", ProductController.displayBook);

module.exports = router;

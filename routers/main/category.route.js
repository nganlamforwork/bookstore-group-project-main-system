const express = require("express");
const router = express.Router();
const CategoryController = require("../../controllers/main/category.controller.js");

router.get("/", CategoryController.displayCategory);
router.post("/filter", CategoryController.filter);

module.exports = router;

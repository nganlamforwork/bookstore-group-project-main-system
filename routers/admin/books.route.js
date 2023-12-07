const express = require("express");
const router = express.Router();
const booksController = require("../../controllers/admin/books.controller");

router.get("/", booksController.getBooks);
router.get("/:id", booksController.getDetailBookPage);
router.post("/:id/update", booksController.updateDetailBook);
router.post("/new", booksController.addBook);
router.post("/delete/:id", booksController.deleteBookById);

module.exports = router;

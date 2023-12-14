const express = require("express");
const router = express.Router();
const customersController = require("../../controllers/admin/customers.controller");

router.get("/", customersController.getAll);
router.get("/:id", customersController.getDetailCustomerPage);
router.post("/:id/update", customersController.update);
router.post("/:id/delete", customersController.delete);
router.post("/:id/addresses/:aid/delete", customersController.deleteAddress);
router.post("/:id/addresses/:aid/update", customersController.updateAddress);
router.post(
  "/:id/addresses/:aid/makedefault",
  customersController.makeDefaultAddress
);
router.post("/:id/addresses/add", customersController.addAddress);
// router.post("/new", customersController.addBook);

module.exports = router;

const express = require("express");
const router = express.Router();
const CustomersController = require("../../controllers/admin/customers.controller");

router.get("/", CustomersController.getAll);

router.get("/:id", CustomersController.displayDetailCustomer);
router.post("/:id/update", CustomersController.update);
router.post("/:id/delete", CustomersController.delete);

router.post("/:id/addresses/add", CustomersController.addAddress);
router.post("/:id/addresses/:aid/delete", CustomersController.deleteAddress);
router.post("/:id/addresses/:aid/update", CustomersController.updateAddress);
router.post(
  "/:id/addresses/:aid/makedefault",
  CustomersController.makeDefaultAddress
);

module.exports = router;

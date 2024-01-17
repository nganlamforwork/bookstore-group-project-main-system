const CustomerModel = require("../../models/admin/customers.model");
const AddressesModel = require("../../models/main/profile/addresses.model");

const CustomerController = {
  getAll: async (req, res, next) => {
    try {
      const users = await CustomerModel.getAllWithAddresses();
      let sanitizedUsers = users.map((user, index) => {
        return {
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "",
          default_payment: user.default_payment || "",
          default_address: user.default_address
            ? `${user.addressInfo.name}<br/>${user.addressInfo.phone}<br/>${user.addressInfo.address}`
            : "No default address",
          created_at: user.created_at || "",
          last_updated: user.last_updated || "",
          _id: user._id || "",
          index: index + 1
        };
      });

      const PER_PAGE = 3;
      const page = 1;
      const offset = (page - 1) * PER_PAGE;
      const totalPages = Math.ceil(sanitizedUsers.length / PER_PAGE);

      sanitizedUsers = sanitizedUsers.slice(offset, offset + PER_PAGE);

      res.render("admin/customers", {
        title: "Customers",
        layout: "admin",
        users: sanitizedUsers,
        page, totalPages
      });
    } catch (error) {
      next(err);
    }
  },
  displayDetailCustomer: async (req, res, next) => {
    try {
      const customer = await CustomerModel.getById(req.params.id);
      let addresses = await AddressesModel.getAll(req.params.id);
      const defaultAddressId = customer._doc.default_address;

      addresses = addresses.map((address) => ({
        ...address._doc,
        default: address._id.equals(defaultAddressId),
      }));

      res.render("admin/customerDetail", {
        title: "Detail Customer",
        layout: "admin",
        customer: customer,
        addresses: addresses,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const customerId = req.params.id;
      await CustomerModel.updateById(customerId, req.body);
      res.redirect(`/admin/customers/${customerId}`);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const customerId = req.params.id;
      await CustomerModel.deleteById(customerId);
      res.redirect("/admin/customers");
    } catch (error) {
      next(error);
    }
  },

  addAddress: async (req, res, next) => {
    try {
      const data = { customer_id: req.params.id, ...req.body };
      const address = await AddressesModel.add(data);
      if (req.body.defaultAddress === "on") {
        await AddressesModel.changeDefault(req.params.id, address._id);
      }
      res.redirect(`/admin/customers/${req.params.id}`);
    } catch (error) {
      next(err);
    }
  },
  deleteAddress: async (req, res, next) => {
    try {
      await AddressesModel.delete(req.params.id, req.params.aid);
      res.redirect(`/admin/customers/${req.params.id}`);
    } catch (error) {
      next(err);
    }
  },
  updateAddress: async (req, res, next) => {
    try {
      if (req.body.defaultAddress == "on") {
        await AddressesModel.changeDefault(req.params.id, req.params.aid);
      }
      await AddressesModel.update(req.params.id, req.params.aid, req.body);
      res.redirect(`/admin/customers/${req.params.id}`);
    } catch (error) {
      next(err);
    }
  },
  makeDefaultAddress: async (req, res, next) => {
    try {
      if (req.body.address == "on")
        await AddressesModel.changeDefault(req.params.id, req.params.aid);
      res.redirect(`/admin/customers/${req.params.id}`);
    } catch (error) {
      next(err);
    }
  },
};

module.exports = CustomerController;

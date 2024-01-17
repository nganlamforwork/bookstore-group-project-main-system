const CustomerModel = require('../../models/main/customer.model');
const SubscriberModel = require('../../models/main/subscriber.model');
const OrderModel = require('../../models/main/order.model');
const BooksModel = require('../../models/admin/books.model');
const CategoriesModel = require('../../models/admin/categories.model');
const PaymentHistoryModel = require('../../models/payment/history.model');
const CustomerAdminModel = require('../../models/admin/customers.model');

const adminController = {
  getAdminProfile: async (req, res, next) => {
    try {
      res.render('admin/profile', {
        title: 'Admin Profile',
        layout: 'admin',
        admin: req.user,
      });
    } catch (error) {
      next(err);
    }
  },
  getLoginAdmin: async (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        res.redirect('/admin/dashboard');
        req.flash('error', 'Invalid email or password');
      }
      res.render('admin/login', {
        title: 'Admin Login',
        layout: 'base',
        error: req.flash('error'),
        success: req.flash('success'),
      });
    } catch (error) {
      next(err);
    }
  },
  getAdminDashboard: async (req, res, next) => {
    try {
      const customers = await CustomerModel.getAll();
      const books = await BooksModel.getAll();
      const categories = await CategoriesModel.getAll();
      const transactions = await PaymentHistoryModel.getAll();
      const orders = await OrderModel.getAll();
      const subscribers = await SubscriberModel.getAll();

      let totalRevenue = transactions.reduce(
        (acc, transaction) => acc + transaction.amount,
        0
      );

      res.render('admin/dashboards', {
        title: 'Admin Dashboard',
        layout: 'admin',
        totalCustomers: customers.length,
        totalBooks: books.length,
        totalRevenue,
        totalOrders: orders.length,
        totalSubscribers: subscribers.length,
        totalCategories: categories.length,
        success: req.flash('success'),
        error: req.flash('error'),
      });
    } catch (error) {
      next(err);
    }
  },
  getSubscribers: async (req, res, next) => {
    try {
      const subscribers = await SubscriberModel.getAll();
      let sanitizedSubscribers = subscribers.map((subscriber, index) => {
        return {
          email: subscriber.email || '',
          created_at: subscriber.created_at.toLocaleString(),
          index: index + 1,
        };
      });

      const page = 1;
      const offset = (page - 1) * 4;
      const totalPages = Math.ceil(sanitizedSubscribers.length / 4);

      sanitizedSubscribers = sanitizedSubscribers.slice(offset, offset + 4);

      res.render('admin/subscribers', {
        title: 'Subscribers',
        layout: 'admin',
        subscribers: sanitizedSubscribers,
        page,
        totalPages,
      });
    } catch (error) {
      next(err);
    }
  },
  getSubscribersFilter: async (req, res, next) => {
    try {
      const subscribers = await SubscriberModel.getAll();
      let sanitizedSubscribers = subscribers.map((subscriber, index) => {
        return {
          email: subscriber.email || '',
          created_at: subscriber.created_at.toLocaleString(),
          index: index + 1,
        };
      });

      const page = parseInt(req.query?.page) || 1;
      const offset = (page - 1) * 4;
      const totalPages = Math.ceil(sanitizedSubscribers.length / 4);

      sanitizedSubscribers = sanitizedSubscribers.slice(offset, offset + 4);

      res.json({
        subscribers: sanitizedSubscribers,
        page,
        totalPages,
      });
    } catch (error) {
      next(err);
    }
  },
  getCustomersFilter: async (req, res, next) => {
    try {
      const users = await CustomerAdminModel.getAllWithAddresses();
      let sanitizedUsers = users.map((user, index) => {
        return {
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          phone: user.phone || '',
          default_payment: user.default_payment || '',
          default_address: user.default_address
            ? `${user.addressInfo.name}<br/>${user.addressInfo.phone}<br/>${user.addressInfo.address}`
            : 'No default address',
          created_at: user.created_at || '',
          last_updated: user.last_updated || '',
          _id: user._id || '',
          index: index + 1,
        };
      });

      const PER_PAGE = 3;
      const page = parseInt(req.query?.page) || 1;
      const offset = (page - 1) * PER_PAGE;
      const totalPages = Math.ceil(sanitizedUsers.length / PER_PAGE);

      sanitizedUsers = sanitizedUsers.slice(offset, offset + PER_PAGE);

      res.json({
        users: sanitizedUsers,
        page,
        totalPages,
      });
    } catch (error) {
      next(err);
    }
  },
  logOut: async (req, res, next) => {
    try {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        // Successful logout: Perform any additional tasks like clearing session data, etc. if needed
        req.locals = {};
        res.redirect('/admin');
      });
    } catch (err) {
      next(err);
    }
  },
  getBooksFilter: async (req, res, next) => {
    try {
      let books = await BooksModel.getAll();
      let filters = req.query;

      const page = parseInt(filters?.page) || 1;
      const offset = (page - 1) * 4;
      const totalPages = Math.ceil(books.length / 4);

      books = books.slice(offset, offset + 4);

      res.json({
        books,
        page,
        totalPages,
      });
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  },
  getReviews: async (req, res, next) => {
    try {
      res.render('admin/reviews', {
        title: 'Reviews',
        layout: 'admin',
        reviews: [],
      });
    } catch (error) {
      next(err);
    }
  },
  getRevenue: async (req, res, next) => {
    try {
      const transactions = await PaymentHistoryModel.getAll();
      res.status(200).send(transactions);
    } catch (error) {
      next(error);
    }
  },
  getOrders: async (req, res, next) => {
    try {
      const orders = await OrderModel.getAll();
      res.status(200).send(orders);
    } catch (error) {
      next(error);
    }
  },
  getOrdersFilter: async (req, res, next) => {
    try {
      let result = [];
      let tmpOrder;
      let orders = await OrderModel.getAll();
      for (let index in orders) {
        let order = orders[index];
        tmpOrder = { ...order._doc };
        // Fetch the customer information using customerId
        const customer = await CustomerModel.getById(tmpOrder.customerId);
        // Add customer email to the customerName field in the order
        tmpOrder.customer_name = customer.email;

        let tmpProductList = [];
        let tmpProduct;
        for (const prod of tmpOrder.products) {
          tmpProduct = { ...prod._doc };
          const book = await BooksModel.getById(prod.bookId);
          tmpProduct.book = book;

          tmpProductList.push(tmpProduct);
        }

        tmpOrder.products = tmpProductList;
        tmpOrder.index = parseInt(index) + 1;
        result.push(tmpOrder);
      }

      const PER_PAGE = 3;
      const page = parseInt(req.query?.page) || 1;
      const offset = (page - 1) * PER_PAGE;
      const totalPages = Math.ceil(result.length / PER_PAGE);
      result = result.slice(offset, offset + PER_PAGE);

      res.status(200).json({ orders: result, page, totalPages });
    } catch (error) {
      next(error);
    }
  },
  getOrdersList: async (req, res, next) => {
    try {
      let orders = await OrderModel.getAll();
      for (let index in orders) {
        let order = orders[index];
        // Fetch the customer information using customerId
        const customer = await CustomerModel.getById(order.customerId);

        // Add customer email to the customerName field in the order
        order['customer_name'] = customer.email;

        for (const prod of order.products) {
          const book = await BooksModel.getById(prod.bookId);
          prod['book'] = book;
        }
        order.index = parseInt(index) + 1;
      }

      const PER_PAGE = 3;
      const page = 1;
      const offset = (page - 1) * PER_PAGE;
      const totalPages = Math.ceil(orders.length / PER_PAGE);
      orders = orders.slice(offset, offset + PER_PAGE);

      res.render('admin/orders', {
        title: 'Orders List',
        layout: 'admin',
        orders,
        page,
        totalPages,
      });
    } catch (error) {
      next(err);
    }
  },
};
module.exports = adminController;

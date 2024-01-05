const homeController = {
  show: async (req, res, next) => {
    const fakeData = [
      {
        id: 1,
        activity: "Pay bookstore bill",
        date: "January 5th, 2024",
        amount: -1000,
        status: "Success",
      },
      {
        id: 2,
        activity: "Pay bookstore bill",
        date: "January 5th, 2024",
        amount: -1000,
        status: "Success",
      },
      {
        id: 3,
        activity: "Top-up Visa card",
        date: "January 6th, 2024",
        amount: 500,
        status: "Success",
      },
      {
        id: 4,
        activity: "Top-up Visa card",
        date: "January 6th, 2024",
        amount: 500,
        status: "Success",
      },
      {
        id: 5,
        activity: "Top-up Visa card",
        date: "January 7th, 2024",
        amount: 300,
        status: "Success",
      },
    ];
    try {
      res.render("payment/home", {
        title: "Payment - Home",
        layout: "payment",
        transactions: fakeData,
      });
    } catch (error) {
      next(error);
    }
  },
  showLogIn: async (req, res, next) => {
    try {
      res.render("payment/login", {
        title: "Log In",
        layout: "payment",
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = homeController;

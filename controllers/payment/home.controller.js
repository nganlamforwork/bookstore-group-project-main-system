const homeController = {
  show: async (req, res, next) => {
    try {
      res.redirect("/login");
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

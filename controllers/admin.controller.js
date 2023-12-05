const adminController = {
  getAdminDashboard: async (req, res, next) => {
    try {
      res.render("dashboard/dashboards", {
        title: "Admin Dashboard",
        layout: "admin",
      });
    } catch (error) {
      next(err);
    }
  },
  getUsers: async (req, res, next) => {
    try {
      res.render("dashboard/users", {
        title: "Users",
        layout: "admin",
      });
    } catch (error) {
      next(err);
    }
  },
};
module.exports = adminController;

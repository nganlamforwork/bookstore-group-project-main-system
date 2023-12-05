const adminController = {
  getAdminDashboard: async (req, res, next) => {
    try {
      res.render("dashboard/admin", {
        title: "Admin Dashboard",
        layout: "admin",
      });
    } catch (error) {
      next(err);
    }
  },
};
module.exports = adminController;

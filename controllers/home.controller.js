const BooksModel = require('../models/admin/books.model');

const homeController = {
  show: async (req, res, next) => {
    try {
      let newArrivalBooks = await BooksModel.getAll();
      if (newArrivalBooks?.length > 0) {
        newArrivalBooks = newArrivalBooks.slice(0,4);
      }

      res.render('home', {
        title: 'Home',
        success: req.flash('success'),
        error: req.flash('error'),
        newArrivalBooks
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = homeController;

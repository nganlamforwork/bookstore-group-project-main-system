const BalanceModel = require("../../models/payment/balance.model");

const balanceController = {
  show: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const balance = await BalanceModel.getBalance(userId);
      res.render("balance/recharge", {
        title: "Recharge Your Balance",
        layout: "base",
        balance: balance,
      });
    } catch (error) {
      next(error);
    }
  },
  rechargeBalance: async (req, res, next) => {
    try {
      const { cardholderName, cardNumber, expires, cvv, amount } = req.body;

      const userId = req.params.userId;

      // check if balance exists, refill
      const existingBalance = await BalanceModel.getBalance(userId);
      if (existingBalance) {
        // If the balance already exists, update its amount in the balance
        const updatedAmount =
          parseInt(existingBalance.amount) + parseInt(amount);

        await BalanceModel.updateBalance(existingBalance._id, updatedAmount);
      } else {
        await BalanceModel.rechargeBalance(
          userId,
          cardholderName,
          cardNumber,
          expires,
          cvv,
          parseInt(amount)
        );
      }
      res.status(200).send({
        success: true,
        message: "Recharge Balance successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = balanceController;

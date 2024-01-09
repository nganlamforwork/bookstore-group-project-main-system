const db = require("../db");
const schema = "payment_balance";

const BalanceModel = {
  rechargeBalance: async (
    customerId,
    cardholderName,
    cardNumber,
    expires,
    cvv,
    amount
  ) => {
    try {
      const result = await db.add(schema, {
        customerId,
        cardholderName,
        cardNumber,
        expires,
        cvv,
        amount,
      });
      return result;
    } catch (err) {
      console.error(err);
    }
  },
  getBalance: async (customerId) => {
    try {
      const balance = await db.get(schema, "customerId", customerId);
      return balance;
    } catch (err) {
      console.log(err);
    }
  },
  updateBalance: async (balanceId, updatedBalance) => {
    try {
      const updateData = { amount: updatedBalance };
      const result = await db.update(schema, "_id", balanceId, updateData);
      return result;
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = BalanceModel;

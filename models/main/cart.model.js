const db = require("../db");
const schema = "carts";

const CartModel = {
  addToCart: async (customerId, bookId, quantity) => {
    try {
      await db.add(schema, {
        customerId,
        bookId,
        quantity,
      });
    } catch (err) {
      console.error(err);
    }
  },
  getCartByCustomerId: async (customerId) => {
    try {
      const carts = await db.getAll(schema, "customerId", customerId);
      return carts;
    } catch (err) {
      console.log(err);
    }
  },
  getCartItem: async (customerId, bookId) => {
    try {
      const bookInCart = await db.getQuery(schema, {
        customerId: customerId,
        bookId: bookId,
      });
      return bookInCart;
    } catch (err) {
      console.log(err);
    }
  },
  updateQuantity: async (cartId, updatedQuantity) => {
    try {
      const updateData = { quantity: updatedQuantity };
      const result = await db.update(schema, "_id", cartId, updateData);

      return result;
    } catch (err) {
      console.log(err);
    }
  },
  removeFromCart: async (customerId, bookId) => {
    try {
      const remainInCart = await db.deleteQuery(schema, {
        customerId,
        bookId,
      });
      return remainInCart;
    } catch (err) {
      console.log(err);
    }
  },
  removeAll: async (customerId) => {
    try {
      const remainInCart = await db.deleteAll(schema, {
        customerId,
      });
      return remainInCart;
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = CartModel;

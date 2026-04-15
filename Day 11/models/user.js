const mongoose = require("mongoose");
const Order = require("./order");


const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartItemIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartItemIndex >= 0) {
    newQuantity = this.cart.items[cartItemIndex].quantity + 1;
    updatedCartItems[cartItemIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};
userSchema.methods.getCart = function(){
  return this.populate('cart.items.productId')
}
userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

userSchema.methods.addOrder = function () {
  return this.getCart()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          username: this.username,
          userId: this._id,
        },
        products: products,
      });
      return order.save();
    })
    .then(() => {
      return this.clearCart();
    });
};

userSchema.methods.getOrders = function () {
  return Order.find({ "user.userId": this._id });
};

userSchema.methods.addOrder = function () {
  return this.getCart()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          username: this.username,
          userId: this._id,
        },
        products: products,
      });
      return order.save();
    })
    .then(() => {
      return this.clearCart();
    });
};

userSchema.methods.getOrders = function () {
  return Order.find({ "user.userId": this._id });
};

module.exports = mongoose.model("User", userSchema);

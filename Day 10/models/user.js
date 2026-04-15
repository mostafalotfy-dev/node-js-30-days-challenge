const { getDb } = require("../util/database");
const { ObjectId } = require("mongodb");
class User {
  constructor(username, email, id, cart) {
    this._id = id;
    this.username = username;
    this.email = email;

    this.cart = cart;
  }
  save() {
    const db = getDb();
    this.cart = this.cart || { items: [] };
    return db.collection("users").insertOne(this);
  }
  addToCart(product) {
    const db = getDb();
    const cart = this.cart || { items: [] };
    const cartItemIndex = cart.items.findIndex((cp) => {
      // console.log("cp " + cp.productId)
      // console.log("product " + product._id)
      return cp.productId.toString() === product._id.toString();
    });
    console.log("cartItemIndex " + cartItemIndex);
    const updatedCartItems = [...cart.items];
    let updatedCart;
    if (cartItemIndex >= 0) {
      updatedCartItems[cartItemIndex].quantity += 1;
      updatedCart = { items: updatedCartItems };
    } else {
      updatedCartItems.push({ productId: product._id, quantity: 1 });
      updatedCart = { items: updatedCartItems };
    }

    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  addOrder() {
    const db = getDb();
    // console.log("add order", this.cart);
    return this.getCart().then((products) => {
      const order = {
        items: products,
        user: {
          _id: this._id,
          name: this.name,
        },
      };
      return db
        .collection("orders")
        .insertOne(order)
        .then(() => {
          this.cart = { items: [] };
          return db
            .collection("users")
            .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
        });
    });
  }

  deleteFromCartItem(productId) {
    const db = getDb();
    const cart = this.cart || { items: [] };
    console.log("delete", cart);
    const updatedCartItems = cart.items.filter(
      (item) => item.productId != productId,
    );
    return db
      .collection("users")
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } },
      );
  }
  getCart() {
    const db = getDb();
    const cart = this.cart || { items: [] };
    // console.log("get cart",cart)
    const productIds = cart.items.map((i) => i.productId);
    console.log(productIds);
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: cart.items.find((item) => {
              console.log("map", product, item);
              return item.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray();
  }
  static findById(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;

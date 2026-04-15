const { getDb } = require("../util/database");
const { ObjectId } = require("mongodb");
class Product {
  constructor(title, imageUrl, description, price, id, userId) {
    this._id = id ? new ObjectId(id) : null;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.userId = userId;
  }
  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp.then(console.log).catch(console.log);
  }
  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        // console.log(products);
        return products;
      })
      .catch(console.log);
  }
  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new ObjectId(prodId) })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch(console.log);
  }
  static deleteById(prodID) {
    const db = getDb();
    return db.collection("products").deleteOne({ _id: new ObjectId(prodID) });
  }
}

module.exports = Product;

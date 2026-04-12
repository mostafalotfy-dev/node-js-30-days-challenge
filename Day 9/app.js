const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const errorController = require("./controllers/error");
const Product = require("./models/product");
const Cart = require("./models/cart");
const User = require("./models/user");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(console.log);
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// Product.hasMany(Cart,{constraints:true,onDelete:'CASCADE'})
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });
User.hasMany(Product);
User.hasOne(Cart);
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product,{through:OrderItem})
sequelize
    .sync({ alter: false })
//   .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "John",
        email: "[EMAIL_ADDRESS]",
        password: "[PASSWORD]",
      });
    }
    return user;
  })
  .then((user) => {
    return user.getCart().then(cart => {
      if (!cart) {
        return user.createCart();
      }
      return cart;
    });
  })
  .then(() => {
    app.listen(3000);
  })
  .catch(console.log);

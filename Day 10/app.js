const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const { MongoConnect } = require("./util/database");
const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Attach user to every request
app.use((req, res, next) => {
  User.findById("69dea8b188bd9b406a6dfddd")
    .then((user) => {
      if (!user) {
        const newUser = new User("dev", "m@il.com", null, { items: [] });
        return newUser.save().then(() => {
          req.user = newUser;
          next();
        });
      }
      req.user = new User(user.username, user.email, user._id, user.cart);
      next();
    })
    .catch(console.log);
});

// Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Start server after DB connection
MongoConnect(() => {
  app.listen(3000);
});

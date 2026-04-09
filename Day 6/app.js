const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error")
// const { engine } = require('express-handlebars');
// app.engine('hbs', engine({
//   extname:"hbs",
//   layoutsDir:"views/layouts",
//   defaultLayout:"main-layout",
  
// }));

// app.set('view engine', 'hbs');
app.set("view engine","pug");
// app.set("view engine","ejs");
app.set("views","views")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminData.routes);
app.use("/", shopRoutes);
app.use(errorController.get404);
app.listen(3000);

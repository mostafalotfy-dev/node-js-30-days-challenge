const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const multer = require("multer")
const errorController = require("./controllers/error");
const User = require("./models/user");
require('dotenv').config()
const MONGODB_URI = "mongodb://localhost:27017/shop";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const csurf = require("csurf");
const flash = require("connect-flash")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images",express.static(path.join(__dirname, "images")));
app.use(flash())
const csrfToken = csurf()
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collection: "sessions",
    }),
  }),
);
app.use((req,res,next)=>{
  if(!req.session)
  {
    return next()
  }
  
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use((req, res, next) => {
 
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.session.user = user;
      next();
    })
    .catch((err) => console.log(err));
});


const fileFilter = (req,file,cb) => {
  if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
    cb(null,true);
  }else{
    cb(null,false);
  }
}
const fileStorage = multer.diskStorage({
  destination:(req,file,cb) => {
    cb(null,"images")
  },
  filename:(req,file,cb) => {
    cb(null,new Date().toISOString().replace(/:/g,"")+"-"+file.originalname)
  }
})
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single("image"))
app.use(csrfToken)
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);
app.use((error,req,res,next)=>{
   console.log(error)
  res.status(500).render('500', {
    pageTitle: 'Internal Server Error',
    path: '/500',
    isAuthenticated: !!req.session?.isLoggedIn,
    csrfToken:null,
    error:error,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

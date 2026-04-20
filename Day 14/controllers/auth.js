const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: 'mlsn.af683e66990242777645cd7ee07c94b3431533db6cf6fe82818f4a52ebdd4715',
});

const sentFrom = new Sender("MS_aByBEg@test-65qngkdjypjlwr12.mlsender.net", "mostafa");

const recipients = [
  new Recipient("mostafalotfy285@gmail.com", "Mostafa")
];



exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;

            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password !== confirmPassword) {
    return res.redirect("/signup");
  }
  User.findOne({ email: email }).then((userDoc) => {
    if (userDoc) {
      return res.redirect("/signup");
    }
    return bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
        });
        return user.save();
      })
      .then((user) => {
        const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setSubject("This is a Subject")
  .setHtml("<strong>This is the HTML content</strong>")
  .setText("This is the text content");

mailerSend.email
  .send(emailParams)
  .then((response) => console.log(response))
  .then(() => {
    res.redirect("/login");
      })
  .catch((error) => console.log(error));  
      })
      .catch((err) => {
        console.log(err);
      });
      
      
      
  });   
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

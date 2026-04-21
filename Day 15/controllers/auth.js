const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const crypto = require("crypto");
const mailerSend = new MailerSend({
  apiKey:
    "mlsn.e6ac70e72506a8903880f65a44994405dad62dd09f565a23db4e035622501fce",
});

const sentFrom = new Sender(
  "MS_aByBEg@test-65qngkdjypjlwr12.mlsender.net",
  "mostafa",
);

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    csrfToken:req.csrfToken()
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    
    csrfToken:req.csrfToken()
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const error = req.flash("error");
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
  const recipients = [new Recipient(email, "Mostafa")];

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
exports.getResetPassword = (req, res, next) => {
  const error = req.flash("error")
  res.render("auth/reset", {
    path: "/reset-password",
    pageTitle: "Reset Password",
    csrfToken:req.csrfToken(),
    error
  });
};
exports.postResetPassword = (req,res,next) =>{
  let error = req.flash("error","Please Check Your email Again")
  if(error.length > 0)
  {
    error = error[0]
  }else{
    error = null
  }
  crypto.randomBytes(32,(err,buffer)=>{
    if(err)
    {
      res.redirect("/login");
    }
     const recipients = [new Recipient(req.body.email, "Mostafa")];
    const token = buffer.toString("hex");
    User.findOne({email:req.body.email})
    .then((user)=>{
      if(!user)
      {
        console.log("no account found")
        return res.redirect("/login");
      }
      user.token = token;
      user.tokenExpiration = Date.now() + 3600000;
      return user.save();
    })
    .then((result)=>{
      
      const emailParams = new EmailParams()
          .setFrom(sentFrom)
          .setTo(recipients)
          .setSubject("This is a Subject")
          .setHtml(`You Requested A Password Reset <a href="http://localhost:3000/reset-password/${token}">Click here to reset your password</a>`)
          

        mailerSend.email
          .send(emailParams)
          .then((response) => console.log(response))
          .then(()=>res.redirect("/login"))
          .catch((error) => console.log(error));
    })
    .catch((err)=>{
      console.log(err);
      res.redirect("/login");
    })
    
})
}
exports.getUpdatePassword = (req,res)=>{
  const token = req.params.token;
  User.findOne({token:token,tokenExpiration:{$gt:Date.now()}})
  .then((user)=>{
    if(!user)
    {
      return res.redirect("/login");
    }
    res.render("auth/update-password",{
      path:"/update-password",
      pageTitle:"Update Password",
      csrfToken:req.csrfToken(),
      token:token,
      userId:user._id.toString()
    })
  })
  .catch((err)=>{
    console.log(err);
    res.redirect("/login");
  })
}
exports.postUpdatePassword = (req,res)=>{
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const token = req.body.passwordToken;

  if(password !== confirmPassword)
  {
    return res.redirect("/login");
  }
  User.findOne({token:token,tokenExpiration:{$gt:Date.now()}})
  .then((user)=>{

    if(!user)
    {
      return res.redirect("/login");
    }
    return bcrypt.hash(password,12)
    .then((hashedPassword)=>{
      user.password = hashedPassword;
      user.token = null;
      user.tokenExpiration = null;
      return user.save();
    })
    .then((result)=>{
      res.redirect("/login");
    })
    .catch((err)=>{
      console.log(err);
      res.redirect("/login");
    })
  })
  .catch((err)=>{
    console.log(err);
    res.redirect("/login");
  })
}
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

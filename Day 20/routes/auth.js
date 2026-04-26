const express = require("express");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();
const { check, body } = require("express-validator");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail()
      .trim(),
    body("password", "Password has to be valid.")
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail()
      .trim(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 6 characters."
    )
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  authController.postSignup
);
router.get("/reset-password", authController.getResetPassword);
router.post("/reset-password", authController.postResetPassword);
router.get("/reset-password/:token", authController.getUpdatePassword);
router.post("/update-password", authController.postUpdatePassword);
router.post("/logout", authController.postLogout);

module.exports = router;

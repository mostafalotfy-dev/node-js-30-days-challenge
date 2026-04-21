const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignup);
router.get("/reset-password", authController.getResetPassword);
router.post("/reset-password", authController.postResetPassword);
router.get("/reset-password/:token", authController.getUpdatePassword);
router.post("/update-password", authController.postUpdatePassword);
router.post("/logout", authController.postLogout);

module.exports = router;

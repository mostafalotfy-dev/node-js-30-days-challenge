const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");
const cartController = require("../controllers/cart");
router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/cart", cartController.getCart);
router.get("/checkout", cartController.getCheckout);
router.get("/orders", shopController.getOrders);

module.exports = router;

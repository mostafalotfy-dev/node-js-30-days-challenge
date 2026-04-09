const Product = require("../models/product");


exports.getProducts = (req, res, next) => {
  Product.fetchAll((products)=>{
    res.render("shop/product-list.pug", {
    prods: products,
    pageTitle: "All Products",
    docTitle: "All Products",
    path: "/products",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
    formsCSS: true,
    pathExists: true,
  });
});
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products)=>{
    res.render("shop/index.pug", {
    prods: products,
    pageTitle: "Shop",
    docTitle: "Shop",
    path: "/",
   
  });
  })};

exports.getOrders = (req,res,next)=>{
  res.render("shop/orders.pug",{
    pageTitle:"Orders",
    docTitle:"Orders",
    path:"/orders",
  })
}
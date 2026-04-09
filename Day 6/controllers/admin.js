const Product = require("../models/product");


exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product.pug", {
    pageTitle: "Add Product",
    docTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    pathExists: true, // simplified from previously dynamic path check
  });
};

exports.postAddProduct = (req, res, next) => {
  const {title , description ,imageUrl,price} = req.body
  const product = new Product(title,imageUrl,description,price);
  product.save();
  res.redirect("/");
};


exports.getProducts = (req,res)=>{
    Product.fetchAll((products)=>{
        res.render("admin/products.pug",{
            pageTitle:"Admin Products",
            prods:products,
            docTitle:"Admin Products",
            path:"/admin/products",
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
            pathExists: true,
        })
    })
}
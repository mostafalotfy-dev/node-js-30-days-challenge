exports.getCart = (req, res) => {
  res.render("shop/cart.pug", {
    pageTitle: "Cart",
    docTitle: "Cart",
    path: "/cart",
    formsCSS: true,
    productCSS: true,
    activeCart: true,
    pathExists: true,
  });
};




exports.getCheckout = (req, res) => {
  res.render("shop/checkout.pug", {
    pageTitle: "Checkout",
    docTitle: "Checkout",
    path: "/checkout",
    formsCSS: true,
    productCSS: true,
    activeCheckout: true,
    pathExists: true,
  });
};
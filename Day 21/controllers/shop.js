const Product = require("../models/product");
const Order = require("../models/order");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const doc = new PDFDocument();
const path = require("path");
const ITEMS_PER_PAGE = 2;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        csrfToken: req.csrfToken(),
        isAuthenticated: req.session.isLoggedIn,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        page,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        csrfToken: req.csrfToken(),
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .limit(ITEMS_PER_PAGE)
        .skip((page - 1) * ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        csrfToken: req.csrfToken(),
        isAuthenticated: req.session.isLoggedIn,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        page,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.session.user
    .populate("cart.items.productId")

    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        csrfToken: req.csrfToken(),
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.session.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

exports.getCheckout = (req, res, next) => {
  console.log(req.session);
  req.session.user
    .populate("cart.items.productId")

    .then((result) => {
      const products = req.session.user.cart.items;
      let total = 0;
      products.forEach((product) => {
        total += product.quantity * product.productId.price;
      });
      res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
        products: products,
        total,
        csrfToken: req.csrfToken(),
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.session.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  let totalPrice = 0;
  req.session.user
    .populate("cart.items.productId")

    .then((user) => {
      const products = req.session.user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: user.email,
          userId: user,
        },
        products: products,
      });
      return order.save();
    })
    .then((order) => {
      req.session.user.cart.items.forEach((item) => {
        totalPrice += item.quantity * item.productId.price;
      });
      return stripe.checkout.sessions.create({
        mode: "payment",
        success_url: "http://localhost:3000/orders",
        cancel_url: "http://localhost:3000/checkout",
        line_items: req.session.user.cart.items.map((item) => {
          return {
            price_data: {
              currency: "usd",
              unit_amount: +item.productId.price * 100,
              product_data: {
                name: item.productId.title,
              },
            },
            quantity: item.quantity,
          };
        }),
        payment_method_types: ["card"],
      });

    }).then(() => {
      return req.session.user.clearCart();
    }).then(session=>{
      res.redirect(session.url)
    })

    
    
    .catch((err) => {
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => {
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("order not found"));
      }
      if (order.user.userId.toString() !== req.session.user._id.toString()) {
        return next(new Error("unauthorized"));
      }
      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);
      const fileStream = fs.createWriteStream(invoicePath);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"',
      );
      doc.pipe(fileStream);
      doc.pipe(res);
      doc.text("Invoice");
      doc.text("________________");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        doc.text(
          `${prod.product.title} - ${prod.quantity}x - $${prod.product.price}`,
        );
      });
      doc.text("________________");
      doc.text("Total Price:" + totalPrice);
      doc.end();
    })
    .catch((err) => next(err));
};

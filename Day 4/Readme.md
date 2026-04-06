# Templating Engines in Node.js

When building server-side applications with Node.js and Express, you often need a templating engine to render dynamic HTML content. The three most popular choices are **EJS**, **Pug**, and **Handlebars**.

## 1. EJS (Embedded JavaScript)
EJS is perhaps the most straightforward templating engine because it looks like plain HTML with special tags for JavaScript logic.

*   **Syntax:** uses `<%= variable %>` for output and `<% logic %>` for control flow (loops, ifs).
*   **Pros:**
    *   Zero learning curve if you know HTML and JS.
    *   Easy to paste existing HTML snippets.
    *   No need to learn a new syntax for structure.
*   **Cons:**
    *   Can become messy with large amounts of logic in templates.
    *   No layout support out of the box (requires `ejs-mate` or manual includes).

## 2. Pug (formerly Jade)
Pug uses a unique, whitespace-sensitive syntax that removes the need for brackets and closing tags.

*   **Syntax:** `h1 Hello World` instead of `<h1>Hello World</h1>`.
*   **Pros:**
    *   Extremely concise and clean code.
    *   Harder to make syntax errors with tags (no missing `</div>`).
    *   Built-in support for layouts and mixins.
*   **Cons:**
    *   Steeper learning curve.
    *   Whitespace sensitivity can lead to frustrating debugging.
    *   Hard to copy/paste standard HTML.

## 3. Handlebars (HBS)
Handlebars is based on the Mustache templating language and focuses on keeping logic out of the view.

*   **Syntax:** Uses double curly braces `{{ variable }}`.
*   **Pros:**
    *   Enforces a clean separation of concerns (minimal logic in templates).
    *   Very fast performance.
    *   Great for shared templates between client and server.
*   **Cons:**
    *   Limited logic (you often need to write "helpers" for simple things like equality checks).
    *   Requires a bit more setup for layouts.

## 4. How to Install

To use any of these templating engines with Express, you need to install them via npm:

### For EJS:
```bash
npm install ejs
```

### For Pug:
```bash
npm install pug
```

### For Handlebars:
```bash
# Core package
npm install handlebars

# Express wrapper (recommended for Express apps)
npm install express-handlebars
```

---

## 5. How to Use

### Using Pug

#### Step 1: Configure Express to use Pug
```js
// app.js
app.set("view engine", "pug");
app.set("views", "views"); // folder where .pug files live
```

#### Step 2: Render a template from a route
```js
// routes/shop.js
router.get("/", (req, res) => {
  res.render("shop", {
    pageTitle: "Shop",
    prods: products,
    hasProducts: products.length > 0,
  });
});
```

#### Step 3: Write Pug templates
Pug uses **indentation** instead of HTML tags. No closing tags needed.

```pug
//- views/shop.pug
doctype html
html(lang="en")
    head
        title #{pageTitle}
        link(rel="stylesheet", href="/css/main.css")
    body
        h1 My Products
        if prods.length > 0
            each product in prods
                article.card
                    h2 #{product.title}
        else
            h1 No Products Found!
```

#### Step 4: Use layouts with `extends` and `block`
Pug has built-in layout support. Create a base layout and extend it:

```pug
//- views/layouts/main-layout.pug
doctype html
html(lang="en")
    head
        title #{pageTitle}
        link(rel="stylesheet", href="/css/main.css")
        block styles
    body
        header.main-header
            nav
                a(href="/") Shop
                a(href="/admin/add-product") Add Product
        main
            block content
```

Then extend it in child templates:

```pug
//- views/shop.pug
extends layouts/main-layout

block styles
    link(rel="stylesheet", href="/css/product.css")

block content
    if prods.length > 0
        each product in prods
            h2 #{product.title}
    else
        h1 No Products Found!
```

**Key Pug syntax:**
| Syntax | Meaning |
| :--- | :--- |
| `h1 Hello` | `<h1>Hello</h1>` |
| `#{variable}` | Output a variable |
| `.className` | `<div class="className">` |
| `a(href="/")` | `<a href="/">` |
| `if / else` | Conditional rendering |
| `each item in list` | Loop through an array |
| `extends` / `block` | Layout inheritance |

---

### Using EJS

#### Step 1: Configure Express to use EJS
```js
// app.js
app.set("view engine", "ejs");
app.set("views", "views"); // folder where .ejs files live
```

#### Step 2: Render a template from a route
```js
// routes/shop.js
router.get("/", (req, res) => {
  res.render("shop", {
    pageTitle: "Shop",
    prods: products,
    hasProducts: products.length > 0,
    productCSS: true,
    formsCSS: true,
  });
});
```

#### Step 3: Write EJS templates
EJS uses **standard HTML** with special `<% %>` tags for JavaScript:

```ejs
<!-- views/shop.ejs -->
<!DOCTYPE html>
<html lang="en">
<head>
    <title><%= pageTitle %></title>
</head>
<body>
    <main>
        <% if (hasProducts) { %>
            <div class="grid">
                <% prods.forEach(product => { %>
                    <article class="card">
                        <h1><%= product.title %></h1>
                    </article>
                <% }) %>
            </div>
        <% } else { %>
            <h1>No Products Found!</h1>
        <% } %>
    </main>
</body>
</html>
```

#### Step 4: Use layouts with `<%- include() %>`
EJS does **not** have built-in layout support like Pug. Instead, you use `include()` to insert partial files:

```ejs
<!-- views/shop.ejs -->
<%- include("layouts/head.ejs") %>
    <main>
        <h1>Shop Page</h1>
    </main>
<%- include("layouts/footer.ejs") %>
```

**Key EJS syntax:**
| Syntax | Meaning |
| :--- | :--- |
| `<%= variable %>` | Output a variable (HTML-escaped) |
| `<%- variable %>` | Output raw/unescaped HTML |
| `<% code %>` | Run JavaScript logic (no output) |
| `<%- include("path") %>` | Include a partial template |
| `<% if () { %> ... <% } %>` | Conditional rendering |
| `<% array.forEach(item => { %> ... <% }) %>` | Loop through an array |

---

### Using Handlebars

#### Step 1: Install and configure Express-Handlebars
Handlebars requires extra setup compared to Pug and EJS:

```js
// app.js
const { engine } = require("express-handlebars");

app.engine("hbs", engine({
  extname: "hbs",                   // use .hbs extension instead of .handlebars
  layoutsDir: "views/layouts",       // where layout files live
  defaultLayout: "main-layout",     // default layout to use
}));

app.set("view engine", "hbs");
app.set("views", "views");
```

#### Step 2: Render a template from a route
Since Handlebars has **very limited logic**, you need to compute booleans in the route:

```js
// routes/shop.js
router.get("/", (req, res) => {
  res.render("shop", {
    pageTitle: "Shop",
    prods: products,
    hasProducts: products.length > 0,  // must pass a boolean
    productCSS: true,
    formsCSS: true,
    pathExists: path === "/" ? "active" : "",
  });
});
```

#### Step 3: Write Handlebars templates
Handlebars uses `{{ }}` double curly braces and looks like plain HTML:

```handlebars
<!-- views/shop.hbs -->
<main>
    {{#if hasProducts}}
        <div class="grid">
            {{#each prods}}
                <article class="card">
                    <h1>{{ this.title }}</h1>
                </article>
            {{/each}}
        </div>
    {{else}}
        <h1>No Products Found!</h1>
    {{/if}}
</main>
```

#### Step 4: Use layouts with `{{{body}}}`
Handlebars has built-in layout support. The `{{{body}}}` placeholder is where child content gets injected:

```handlebars
<!-- views/layouts/main-layout.hbs -->
<!DOCTYPE html>
<html lang="en">
<head>
    <title>{{pageTitle}}</title>
    {{#if formsCSS}}
        <link rel="stylesheet" href="/css/main.css">
    {{/if}}
    {{#if productCSS}}
        <link rel="stylesheet" href="/css/product.css">
    {{/if}}
</head>
<body>
    <header class="main-header">
        <nav>
            <a href="/" class="{{pathExists}}">Shop</a>
            <a href="/admin/add-product">Add Product</a>
        </nav>
    </header>
    <main>{{{body}}}</main>
</body>
</html>
```

**Key Handlebars syntax:**
| Syntax | Meaning |
| :--- | :--- |
| `{{ variable }}` | Output a variable (HTML-escaped) |
| `{{{ variable }}}` | Output raw/unescaped HTML |
| `{{#if}} ... {{else}} ... {{/if}}` | Conditional rendering |
| `{{#each list}} ... {{/each}}` | Loop through an array |
| `{{ this.property }}` | Access current item inside `#each` |
| `{{{body}}}` | Placeholder for child content in layouts |



## Comparison Table

| Feature | EJS | Pug | Handlebars |
| :--- | :--- | :--- | :--- |
| **Syntax** | HTML-like | Indentation-based | Mustache-style (`{{ }}`) |
| **Learning Curve** | Very Low | High | Medium |
| **Logic in View** | Full JS support | Limited | Very Limited (Helpers only) |
| **Performance** | Fast | Moderate | Very Fast |
| **Code Conciseness** | Low (Verbose) | Very High | Moderate |

## Which one should you choose?

- **Choose EJS** if you want to get started quickly and prefer working with standard HTML.
- **Choose Pug** if you want to write the absolute minimum amount of code and like Python-style indentation.
- **Choose Handlebars** if you want to strictly separate your logic from your presentation and want a familiar syntax across different platforms.

---

## Code Explanation

### `app.js` — Main Application Entry Point

```js
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
```
- **`path`**: Built-in Node.js module used for constructing file paths across operating systems.
- **`express`**: The web framework. `app` is the Express application instance.
- **`body-parser`**: Middleware that parses incoming request bodies (form data) so we can access `req.body`.
- **`adminData`** and **`shopRoutes`**: Import the route handlers from separate files to keep the code modular.

```js
app.set("view engine", "ejs");
app.set("views", "views");
```
- **`app.set("view engine", "ejs")`**: Tells Express to use **EJS** as its templating engine. (Note: You can switch this to `pug` or `hbs` if those engines are configured).
- **`app.set("views", "views")`**: Tells Express that template files are located in the `views/` folder.

```js
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
```
- **`bodyParser.urlencoded()`**: Parses URL-encoded form data (e.g., from `<form>` submissions). `extended: false` uses the simpler `querystring` library.
- **`express.static()`**: Serves static files (CSS, images, JS) from the `public/` directory. Any file inside `public/` can be accessed directly by the browser.

```js
app.use("/admin", adminData.routes);
app.use("/", shopRoutes);
```
- **`app.use("/admin", adminData.routes)`**: All routes defined in `admin.js` will be prefixed with `/admin`. For example, a route for `/add-product` becomes `/admin/add-product`.
- **`app.use("/", shopRoutes)`**: Mounts all shop routes at the root `/` path.

```js
app.use((_req, res) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: ""
  });
});
app.listen(3000);
```
- **404 Handler**: Instead of `sendFile()`, we now use `render()` to show a dynamic 404 page using the active templating engine.
- **`app.listen(3000)`**: Starts the server on port 3000.

---

### `routes/admin.js` — Admin Route Handler

```js
const rootDir = require("../utils/path");
const express = require("express");
const router = express.Router();
const path = require("path");
const products = [];
```
- **`rootDir`**: Imports the project root directory path from the utility helper.
- **`router`**: Creates a new Express Router instance to define admin-specific routes.
- **`products`**: An in-memory array used to store products. This data is shared with the shop route.

```js
router.get("/add-product", (_req, res) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    docTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
});
```
- Handles **GET** requests to `/admin/add-product`.
- **`res.render()`**: Renders the `add-product` template and passes configuration data like `path` and `pageTitle`.

```js
router.post("/add-product", (req, res) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});
```
- Handles **POST** requests to `/admin/add-product` (when the form is submitted).
- **`req.body.title`**: Extracts the `title` field from the submitted form data.
- **`products.push()`**: Adds the new product object to the in-memory array.
- **`res.redirect("/")`**: Redirects the user back to the shop home page.

```js
exports.routes = router;
exports.products = products;
```
- Exports **both** the router and the products array. This allows `shop.js` to access the same products list and display them.

---

### `routes/shop.js` — Shop Route Handler

```js
const express = require("express");
const router = express.Router();
const rootDir = require("../utils/path");
const path = require("path");
const adminData = require("./admin");
```
- Imports the admin module to access the shared `products` array via `adminData.products`.

```js
router.get("/", (_req, res) => {
  console.log(adminData.products);
  res.render("shop", {
    pageTitle: "Shop",
    docTitle: "Shop",
    prods: adminData.products,
    path: "/",
    hasProducts: adminData.products.length > 0,
    activeShop: true,
    productCSS: true,
    formsCSS: true,
  });
});
```
- Handles **GET** requests to `/`.
- **`res.render("shop", { ... })`**: This is the key difference from Day 3. Instead of `res.sendFile()`, we use `res.render()` which tells Express to use the **Pug templating engine** to render the `shop.pug` template.
- The second argument is a **data object** passed to the template:
  - **`prods`**: The array of products to display.
  - **`hasProducts`**: A boolean flag — `true` if there are products, `false` otherwise. Used for conditional rendering in the template.
  - **`activeShop`**, **`productCSS`**, **`formsCSS`**: Flags used to control active navigation states and which CSS files to include.

---

### `utils/path.js` — Root Directory Helper

```js
const path = require("path");

module.exports = path.dirname(require.main.filename);
```
- **`require.main.filename`**: Returns the absolute path of the file that started the Node.js process (i.e., `app.js`).
- **`path.dirname()`**: Extracts just the directory portion of that path.
- This gives us a reliable way to get the **project root directory** from anywhere in the codebase, regardless of which file imports it.

---

### `views/shop.pug` — Pug Template

```pug
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title #{docTitle}
        link(rel="stylesheet", href="/css/main.css")
        link(rel="stylesheet", href="/css/product.css")
    body
        header.main-header
            ul.main-header__nav
                li.main-header__item
                    a.active(href="/") Shop
                li.main-header__item
                    a(href="/admin/add-product") Add Product
        main
            .grid
                article.card.product-item
```
- **Indentation-based syntax**: Pug uses indentation instead of closing tags. Each nested element is indented by one level.
- **`#{docTitle}`**: Outputs the value of the `docTitle` variable passed from `res.render()`.
- **`.main-header`**: A shorthand for `<div class="main-header">`. The dot `.` creates a class, and `header.main-header` creates `<header class="main-header">`.
- **`a.active(href="/")`**: Creates `<a class="active" href="/">`. Attributes go inside parentheses `()`.
- **`.grid`**: Shorthand for `<div class="grid">`.
- **`article.card.product-item`**: Creates `<article class="card product-item">` — multiple classes are chained with dots.

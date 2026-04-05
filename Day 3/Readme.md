# Day 3: Express.js Fundamentals

## What is Express.js?
Express.js, or simply Express, is a **minimal and flexible Node.js web application framework** that provides a robust set of features for web and mobile applications. It is the de facto standard server framework for Node.js.

## Why use Express.js?
While Node.js provides a built-in `http` module, it can be quite verbose and low-level for complex applications. Express simplifies the process of building web servers by providing:

- **Simplified Routing**: Easily define routes for different HTTP methods (GET, POST, PUT, DELETE) and URLs.
- **Middleware Support**: Execute code, make changes to the request and response objects, and end the request-response cycle.
- **Improved Request/Response Handling**: Enhances the standard Node `req` and `res` objects with helpful methods like `res.json()`, `res.send()`, etc.
- **Template Engines**: Supports various template engines (like EJS, Pug, Handlebars) to generate dynamic HTML.
    - **Performance**: It is lightweight and doesn't obscure Node.js features that you know and love.

## Deep Dive into Middleware
Express is essentially a series of middleware function calls. A middleware function is a function that has access to the **request (req)**, **response (res)**, and the **next middleware function** in the application’s request-response cycle.

### What can Middleware do?
- **Execute any code**: Perform tasks like logging, authentication, etc.
- **Modify Request/Response**: Add properties to `req` or `res` objects (e.g., adding `req.user` after authentication).
- **End the Cycle**: Send a response to the client (`res.send()`, `res.json()`).
- **Pass Control**: Move to the next middleware by calling `next()`.

### Types of Middleware
1. **Application-level**: Bound to the `app` object using `app.use()` or `app.METHOD()`.
   ```javascript
   app.use((req, res, next) => {
       console.log('Time:', Date.now());
       next();
   });
   ```
2. **Router-level**: Bound to an instance of `express.Router()`.
3. **Error-handling**: Defined with four arguments instead of three (`err, req, res, next`).
   ```javascript
   app.use((err, req, res, next) => {
       console.error(err.stack);
       res.status(500).send('Something broke!');
   });
   ```
4. **Built-in Middleware**: Provided by Express (e.g., `express.json()`, `express.static()`).
5. **Third-party Middleware**: Installed via npm (e.g., `morgan`, `cookie-parser`).

### The importance of `next()`
If your middleware doesn't end the response cycle, it **must** call `next()`. If you forget, the request will hang, and the client will eventually time out.

## Handling Routes
In Express, you can handle different URLs (routes) by passing a path as the first argument to `app.use()` or HTTP method functions like `app.get()`, `app.post()`, etc.

### How Routing Works
Express matches request paths from **top to bottom**. The first middleware that matches the path and *does not* call `next()` will end the response cycle.

### Practical Example (HTML Serving & Filtering)
Based on our latest structure, we now serve actual HTML files from a `views/` folder.

#### 1. The main entry point (`app.js`)
```javascript
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Serving Static Files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);
```

#### 2. The admin routes (`routes/admin.js`)
```javascript
const path = require("path");
const express = require("express");
const rootDir = require("../utils/path");
const router = express.Router();

router.get("/add-product", (req, res) => {
    res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

router.post("/add-product", (req, res) => {
    res.redirect("/");
});

module.exports = router;
```

#### 3. The path helper (`utils/path.js`)
```javascript
const path = require("path");
module.exports = path.dirname(require.main.filename);
```

### Important: Route Filtering
In `app.js`, we used `app.use("/admin", adminRoutes)`. This means every route defined inside `admin.js` is now automatically prefixed with `/admin`.
- `router.get("/add-product")` in `admin.js` becomes `/admin/add-product` in the browser.

## Serving Static Files
By default, Express doesn't allow access to files in your project folders from the browser. To serve files like CSS, Images, or client-side JavaScript, you must use the `express.static()` middleware.

### How it Works
1. **Create a `public` folder**: This is the standard name for storing static assets.
2. **Register Middleware**:
   ```javascript
   app.use(express.static(path.join(__dirname, "public")));
   ```
3. **Link in HTML**: When linking files in your HTML, you act as if you are already inside the `public` folder:
   ```html
   <!-- If file is in public/css/main.css -->
   <link rel="stylesheet" href="/css/main.css">
   ```

## Serving Static HTML Files
Instead of sending raw HTML strings, we use `res.sendFile()` to serve complete `.html` files.

### Why use `path.join()`?
Operating systems handle file paths differently (Windows uses `\`, Linux uses `/`). The `path.join()` method ensures your application works on **all** systems by constructing paths correctly.

### The `rootDir` Helper
Because using `__dirname` can be tricky when navigating nested folders (like `routes/` to `views/`), we use a central helper:
```javascript
path.join(rootDir, "views", "shop.html")
```
This always points to the root of your project, making path management much easier.

### Important: Route Order
Always put specific routes (like `/add-products`) **above** more general routes (like `/`). Because Express processes code sequentially, a general `/` route placed at the top would match every request, preventing more specific routes below it from ever being reached (unless you call `next()`).

## Modular Routing with `express.Router()`
As your application grows, putting all routes in `app.js` becomes unmanageable. Express provides the `Router` class to create modular, mountable route handlers.

### Key Benefits
- **Organization**: Group related routes (e.g., all admin routes, all shop routes) into separate files.
- **Clean app.js**: Keeps your main entry point focused on global configuration and middleware.
- **HTTP Method Specificity**: Using `router.get()` and `router.post()` ensures that routes only respond to the intended HTTP methods, making your API more robust and predictable.

## Handling Forms & POST Data
To handle data sent from an HTML form, we need to **parse** the request body. By default, Express doesn't parse the body for you.

### body-parser Middleware
- **Installation**: `npm install --save body-parser`
- **Purpose**: It extracts the entire body portion of an incoming request stream and exposes it on `req.body`.
- **`urlencoded`**: This specific parser is used for data sent via HTML forms (`application/x-www-form-urlencoded`).

### Key Methods Used
- **`req.body`**: Holds the key-value pairs of data submitted in the request body (e.g., the `name` attribute of your input fields).
- **`res.redirect('/')`**: Automatically sets the response status to `302` (Found) and tells the browser to navigate to the specified path.
- **`app.listen(3000)`**: A built-in Express method that creates the HTTP server and starts listening for connections, removing the need for `const http = require('http')`.

## Express Generator
The `express-generator` is a tool that quickly creates an application "skeleton" to help you get started with a project structure that includes folders for images, JavaScript, and stylesheets, along with basic routing and views.

### Why Use It?
- **Speed**: Instantly scaffold a complete Express app.
- **Best Practices**: Follows a standard directory structure (`routes/`, `views/`, `public/`, etc.).
- **Configurations**: Easily include view engines (like EJS or Pug) and CSS preprocessors.

### How to Use It
Instead of installing it globally (which may lead to permission errors), it is recommended to use `npx` to run it directly:

1. **Generate the App**:
   ```bash
   npx express-generator --view=ejs my-app
   ```
   *(This creates a folder named `my-app` using the EJS view engine.)*

2. **Navigate and Install Dependencies**:
   ```bash
   cd my-app
   npm install
   ```

3. **Start the Application**:
   ```bash
   # On Windows (Command Prompt):
   set DEBUG=my-app:* & npm start

   # On Windows (PowerShell):
   $env:DEBUG='my-app:*'; npm start
   ```

Now your app is running at `http://localhost:3000`.

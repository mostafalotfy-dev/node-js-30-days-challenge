# Cookies & Sessions 🍪

Welcome to Day 12! Today, we explore how to add "memory" to our web applications. By default, HTTP is **stateless**, meaning every request is independent and the server doesn't "remember" previous interactions. **Cookies** are the first step in solving this.

---

## 🍪 What is a Cookie?

A **Cookie** is a small piece of data (a text file) that a server sends to a user's web browser. The browser may store it and send it back with subsequent requests to the same server. Typically, cookies are used to tell if two requests came from the same browser—keeping a user logged in, for example.

### 🔄 How it Works

1.  **Request**: The browser sends a request to the server (e.g., a login request).
2.  **Response + Set-Cookie**: The server validates the request and sends back a response with a `Set-Cookie` header.
3.  **Storage**: The browser stores this cookie locally.
4.  **Subsequent Requests**: For every future request to that same server, the browser automatically includes the cookie in the `Cookie` header.
5.  **Recognition**: The server reads the cookie and recognizes the user or their preferences.

---

## ⚙️ Key Cookie Attributes

When setting a cookie, we can configure several attributes to control its behavior and security:

*   **`Expires / Max-Age`**: Determines how long the cookie lasts. Without this, the cookie is a "session cookie" and deleted when the browser closes.
*   **`Domain / Path`**: Defines which URLs the cookie is sent to.
*   **`HttpOnly`**: A critical security flag. If true, the cookie cannot be accessed via client-side JavaScript (`document.cookie`), preventing XSS attacks.
*   **`Secure`**: If true, the cookie is only sent over encrypted (HTTPS) connections.
*   **`SameSite`**: Controls whether cookies are sent with cross-site requests (values: `Strict`, `Lax`, or `None`).

---

## 🏗️ Why Use Cookies?

1.  **Session Management**: Logins, shopping carts, game scores, or anything else the server should remember.
2.  **Personalization**: User preferences, themes, and other settings.
3.  **Tracking**: Recording and analyzing user behavior (often used for analytics and ads).

---

## 🛠️ Working with Cookies in Express

There are two main ways to handle cookies in an Express application: using the native `res.setHeader` or the convenience method `res.cookie`.

### 1. Using `res.setHeader` (Manual)
You can set cookies manually by writing to the response header. This is useful for understanding what happens under the hood.

```javascript
exports.postLogin = (req, res, next) => {
  // Set a simple cookie
  res.setHeader('Set-Cookie', 'loggedIn=true');
  
  // Set a cookie with attributes
  res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=3600; HttpOnly');
  
  res.redirect('/');
};
```

### 2. Using `res.cookie()` (Express Method)
Express provides a cleaner API for setting cookies.

```javascript
res.cookie('loggedIn', 'true', {
  maxAge: 3600000, // 1 hour in milliseconds
  httpOnly: true,
  secure: true
});
```

### 3. Reading Cookies
To read cookies sent by the browser, we typically use the `cookie-parser` middleware. Without it, you would have to parse the `req.get('Cookie')` string manually.

**Installation:**
```bash
npm install cookie-parser
```

**Usage:**
```javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Access cookies in any route
app.get('/', (req, res) => {
  console.log(req.cookies.loggedIn); // 'true'
});
```

---

## 🔐 What is a Session?

While cookies are great for simple flags (like a theme preference), they have limitations:
1.  **Security**: Cookies are stored in the user's browser, making them vulnerable to tampering or theft.
2.  **Size**: Browsers limit the size of cookies (usually ~4KB).
3.  **Data Type**: Cookies only store strings.

A **Session** solves this by storing the sensitive data on the **server-side**. The only thing stored in the browser is a **Session ID** (wrapped in a cookie), which acts as a "key" to the session data on the server.

### 🛡️ Session vs. Cookie
| Feature | Cookie | Session |
| :--- | :--- | :--- |
| **Storage Location** | Client (Browser) | Server (Memory or Database) |
| **Security** | Less secure (Client-exposed) | More secure (Server-controlled) |
| **Data Limit** | ~4KB | Virtually unlimited (Limited by server) |
| **Data Types** | Strings only | Objects, Arrays, Numbers, etc. |

---

## 📦 Using Sessions with MongoDB

In a production environment, you should NOT store sessions in the server's memory (the default `MemoryStore`), as it causes memory leaks and lost data on server restarts. Instead, we use a database like **MongoDB**.

### 1. Installation
We use `express-session` for session management and `connect-mongodb-session` to store the data in MongoDB.

```bash
npm install express-session connect-mongodb-session
```

### 2. Implementation in `app.js`

```javascript
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI = 'mongodb://localhost:27017/shop';

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.use(
  session({
    secret: 'my secret password',
    resave: false,
    saveUninitialized: false,
    store: store // Using the MongoDB store
  })
);
```

### 3. Storing and Accessing Session Data
Once the middleware is set up, you can access the session via `req.session`.

```javascript
exports.postLogin = (req, res, next) => {
  // Store data in the session
  req.session.isLoggedIn = true;
  req.session.user = user;
  
  // Ensure the session is saved before redirecting
  req.session.save(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getIndex = (req, res, next) => {
  // Access data from the session
  console.log(req.session.isLoggedIn); // true
  res.render('shop/index', {
    isAuthenticated: req.session.isLoggedIn
  });
};
```

### 4. Destroying a Session (Logout)
```javascript
exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
```

---

## ✅ Day 12 Learning Goals

Today we will:
*   Understand the stateless nature of HTTP.
*   Learn how to set and read cookies in Express.js.
*   Explore cookie security best practices (`HttpOnly`, `Secure`).
*   Transition from plain cookies to **Sessions** for more secure data handling.

---
*Let's give our application a memory!*

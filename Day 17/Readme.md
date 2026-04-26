# Error Handling 🛠️

Welcome to Day 17! In this lesson we focus on **robust error handling** in our Node.js Express application. Proper error management ensures our app stays stable, provides meaningful feedback to users, and simplifies debugging.

---

## 📂 Why Handle Errors?

1. **Stability** – Uncaught errors can crash the server.
2. **User Experience** – Friendly error pages guide users when something goes wrong.
3. **Security** – Prevent leaking stack traces or internal details.
4. **Maintainability** – Centralised handling makes future changes easier.

---

## 🛡️ Express Error‑Handling Middleware

Express recognises a middleware function with **four** arguments as an error handler. It should be placed **after** all regular routes.

```javascript
// errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err); // log for developers
  const status = err.statusCode || 500;
  res.status(status).render('error', {
    pageTitle: 'Error',
    message: err.message || 'Something went wrong!',
    // hide stack in production
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};
```

Then register it in `app.js`:

```javascript
const errorHandler = require('./middleware/errorHandler');
// ... other route definitions
app.use(errorHandler);
```

---

## ⚡ Catching Asynchronous Errors

When using async/await, errors thrown inside the function won’t be caught by Express automatically. Wrap async route handlers with a helper:

```javascript
// utils/asyncWrapper.js
module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

Usage:

```javascript
router.post('/login', asyncWrapper(async (req, res) => {
  // async logic that may throw
}));
```

---

## 📦 Custom Error Classes

Define your own error types for clearer intent.

```javascript
class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Example usage in a controller
if (!product) {
  throw new HttpError('Product not found', 404);
}
```

---

## ✅ Day 17 Learning Goals

- Implement a global **error‑handling middleware**.
- Understand **asynchronous error propagation** with async/await.
- Create and use **custom error classes**.
- Render user‑friendly error pages while keeping stack traces hidden in production.

---

*Graceful error handling makes a resilient application!*
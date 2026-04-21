# Input Validation & Sanitization 🛡️

Welcome to Day 16! Today we focus on a critical aspect of web security and user experience: ensuring the data entering our application is clean, correct, and safe.

---

## 🔍 Why Validate and Sanitize?

Applications cannot trust user input. Whether intentional or accidental, users can provide data that breaks logic or compromises security.

1.  **Data Integrity**: Ensuring required fields are present and follow the correct format (e.g., a real email, a strong password).
2.  **User Experience**: Providing immediate, helpful feedback when a user makes a mistake in a form.
3.  **Security**: Preventing attacks like **SQL Injection** or **Cross-Site Scripting (XSS)** by cleaning data before it reaches our database or views.
4.  **Logic Consistency**: Ensuring that business rules are met (e.g., passwords matching, email uniqueness).

---

## 🛠️ Using `express-validator`

Instead of writing complex `if/else` logic for every field in our controllers, we use the `express-validator` middleware. It allows us to define validation rules directly in our routes.

### 1. Validation Middleware
We can chain validators to check for various conditions:
```javascript
router.post('/signup', 
  [
    check('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 5 }).isAlphanumeric()
  ], 
  authController.postSignup
);
```

### 2. Custom Validators
Sometimes built-in checks aren't enough. Custom validators allow us to run asynchronous logic, like checking a database:
```javascript
check('email').custom((value, { req }) => {
  return User.findOne({ email: value }).then(userDoc => {
    if (userDoc) {
      return Promise.reject('E-Mail exists already, please pick a different one.');
    }
  });
})
```

### 3. Sanitization
Validation checks if data is "good"; Sanitization makes it "clean". We can trim whitespace, normalize email formats, and escape HTML characters:
*   `.trim()`: Removes leading/trailing spaces.
*   `.normalizeEmail()`: Ensures email formats are consistent (e.g., lowercasing).
*   `.escape()`: Replaces HTML special characters to prevent XSS.

---

## 📥 Handling Errors in Controllers

Once the middleware runs, we check for errors in our controller using `validationResult(req)`:

```javascript
const { validationResult } = require('express-validator');

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email, password: password },
      validationErrors: errors.array()
    });
  }
  // ... proceed to save user
};
```

### 📝 The `oldInput` Pattern
To improve UX, we pass the user's input back to the view if validation fails. This prevents the form from clearing, allowing the user to simply fix the error rather than re-typing everything.

---

## ✅ Day 16 Learning Goals

Today we will:
*   Integrate **`express-validator`** into our Express routes.
*   Implement **Built-in Validators** for emails and passwords.
*   Create **Custom Validators** for complex logic (e.g., password matching, email existence).
*   Apply **Sanitization** to ensure clean data storage.
*   Learn to render **Validation Error Messages** back to the user.
*   Master the **`oldInput`** pattern for a seamless user experience.

---
*Clean data leads to a healthy application!*

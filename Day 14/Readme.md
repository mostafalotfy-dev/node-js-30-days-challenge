# Day 14: CSRF Protection & Security Enhancements 🔐

Welcome to Day 14! Today we focused on making our authentication system "production-ready" by adding critical security layers and improving the user experience through session-wide data.

---

## 🛡️ CSRF Protection (Cross-Site Request Forgery)

Security doesn't stop at passwords. CSRF is an attack that tricks a logged-in user into submitting a malicious request to our server. 
- **The Solution**: We integrated `csurf` middleware.
- **How it works**: For every non-GET request (POST, PUT, DELETE), our server expects a unique, secret `_csrf` token. If the token is missing or incorrect, the request is rejected.
- **Implementation**: We pass the `csrfToken` to all our views and include it in a hidden input field in our forms.

## 🔑 Password Hashing with Bcrypt

Storing plain-text passwords is a huge security risk.
- We use **bcryptjs** to hash passwords before saving them to MongoDB.
- During login, we use `bcrypt.compare()` to verify the provided password against the stored hash.
- **Salt Rounds**: We use 12 rounds to ensure the hashing is slow enough to resist brute-force attacks but fast enough for a good user experience.

## 📧 Initial Email Integration

We started integrating **MailerSend** to communicate with users.
- **Signup Emails**: Users now receive a welcome email upon successful signup.
- **Async Handling**: We handle email sending as a promise to ensure it doesn't block the main request flow.

---

## ✅ Day 14 Learning Goals

Today we will:
*   Implement **CSRF Protection** middleware and update all forms.
*   Secure user data using **Bcrypt hashing**.
*   Utilize `app.locals` (or session passing) to share authentication state across all views.
*   Set up the foundation for **Email Services**.

---
*Security is a process, not a product. Let's keep building!*

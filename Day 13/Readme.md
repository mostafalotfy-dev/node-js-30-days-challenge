# Authentication & Authorization 🔐

Welcome to Day 13! After learning about sessions and cookies, it's time to build a real authentication system. Authentication is the process of verifying who a user is, while authorization is the process of verifying what they have access to.

---

## 🔑 What is Authentication?

**Authentication** is the act of proving that a user is who they claim to be. In web applications, this typically involves a user providing a unique identifier (like an email or username) and a secret (a password).

The server then checks these credentials against its records (usually in a database). If they match, the server "authenticates" the user and establishes a session or issues a token to keep them logged in.

---

## 🛡️ Why Use Authentication?

Authentication is a fundamental pillar of web security and user experience. Without it, every user would be "anonymous," and we couldn't provide personalized or secure features.

1.  **Security & Privacy**: Ensures data is only accessible to the owner.
2.  **Accountability**: Tracks who is performing which actions.
3.  **Personalization**: Remembers user-specific settings and state.
4.  **Controlled Access**: Restricts sensitive areas (like Admin panels).

---

## ⚔️ Authentication vs. Authorization

*   **Authentication (Who are you?)**: Verifying your identity (e.g., logging in).
*   **Authorization (What can you do?)**: Verifying your permissions (e.g., can you delete a product?).

---

## 🔐 Key Technical Features

### 1. 🛡️ Password Encryption (bcryptjs)
Storing passwords in plain text is a massive security risk. We use **bcryptjs** to hash passwords.
*   **Hashing**: A one-way function that turns a password into a complex string.
*   **Salting**: Adding random data to the hash to prevent "rainbow table" attacks.
*   **Comparison**: When logging in, we use `bcrypt.compare()` to check if the entered password matches the stored hash.

### 2. 🚪 Route Protection (Middleware)
Not all pages should be public. We use **Middleware** (like `is-auth.js`) to intercept requests:
*   If the user is **logged in**, the request continues (`next()`).
*   If the user is **not logged in**, they are redirected to the `/login` page.

### 3. 🛡️ CSRF Protection (csurf)
**Cross-Site Request Forgery** is a type of attack where a malicious site tricks a user's browser into performing an action on another site where the user is logged in.
*   We use a **CSRF Token** to ensure that requests to our server only come from *our* forms.

### 🔄 Session Persistence
When logging a user in, we call `req.session.save()` before redirecting. This ensures the session is fully updated in the database before the next page request starts, preventing "not-logged-in" errors on the landing page.

---

## ✅ Day 13 Learning Goals

Today we will:
*   Implement a **Signup** and **Login** flow.
*   Securely hash passwords before storing them in the database.
*   Protect routes so only logged-in users can access them.
*   Handle user logout by destroying sessions.

---
*Let's secure our application!*

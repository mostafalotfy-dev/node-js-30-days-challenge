# Advanced Authentication: Emails & Password Reset 📧

Welcome to Day 15! We are expanding our authentication system to include essential real-world features: sending emails and providing a secure "Forgot Password" functionality.

---

## 📧 Why Send Emails?

In modern web applications, emails are a primary way to communicate with users outside of the browser. We use them for:
1.  **Welcome Messages**: Confirming a new account.
2.  **Account Verification**: Ensuring the user owns the email address.
3.  **Password Reset**: Allowing users to regain access to their accounts.
4.  **Notifications**: Updating users on order status or activity.

---

## 🛡️ The Password Reset Flow

Implementing a secure password reset is more than just changing a field in the database. It requires a multi-step process to verify the user's intent:

1.  **Request**: The user enters their email address on a "Reset Password" page.
2.  **Token Generation**: The server uses the built-in `crypto` module to generate a unique, secure, random token.
3.  **Database Storage**: This token is stored on the user's document in MongoDB, along with an **expiration date** (e.g., 1 hour from now).
4.  **Email Delivery**: An email is sent containing a link with the token (e.g., `/reset-password/TOKEN_STRING`).
5.  **Verification**: When the user clicks the link, the server checks if the token exists and if it hasn't expired.
6.  **Update**: If valid, the user is allowed to set a new password, which is then hashed and saved, while the token is cleared.

---

## 🔑 Key Technical Features

### 1. 📬 Email Integration (MailerSend / NodeMailer)
We integrate with external mailing services to ensure high deliverability and security. 
*   **API Keys**: Never hardcode these! Use environment variables.
*   **Templates**: Using HTML and text alternatives for better compatibility.

### 2. 🎲 Secure Token Generation (`crypto`)
Instead of predictable numbers, we use `crypto.randomBytes(32)` to create high-entropy tokens that are impossible to guess.

### ⏳ Token Expiration
Security is temporary. By adding `Date.now() + 3600000`, we ensure that even if an email is intercepted days later, the reset link will no longer work.

---

## ✅ Day 15 Learning Goals

Today we will:
*   Integrate an **Email Service Provider**.
*   Send a **Welcome Email** upon successful signup.
*   Implement the full **Password Reset logic** (Request, Token, Email, Update).
*   Handle **Token Expiration** and security edge cases.

---
*Let's make our authentication system robust and user-friendly!*

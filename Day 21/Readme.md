# Day 21: Payment Integration with Stripe

## Overview
This document details the implementation of payment processing using the Stripe API for Day 21 of the "Node.js 30 Days Challenge". The goal is to provide a seamless and secure checkout experience for users by integrating a third-party payment gateway.

## Key Implementations

- **Stripe API Integration**: Integrated the `stripe` package and initialized it using a secure secret key (`STRIPE_SECRET_KEY`) stored as an environment variable.
- **Environment Variables Management**: Utilized the `dotenv` package to securely manage and load environment variables, keeping sensitive information like API keys out of the source code.
- **Checkout Session Creation**: Updated the order processing logic (`postOrder` controller) to dynamically create a Stripe checkout session. The session is populated with line items based on the products currently in the user's cart.
- **Payment Redirection**: Implemented redirection to the secure Stripe-hosted checkout page. Configured a `success_url` to redirect users to their orders page upon successful payment completion, and a `cancel_url` to return them to the checkout page if the transaction is cancelled.
- **Cart Management**: Ensured that the user's cart is automatically cleared only after the checkout session is successfully created and prepared for redirection.

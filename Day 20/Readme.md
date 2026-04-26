# Day 20: Asynchronous Requests (AJAX/Fetch API) ⚡

In today's challenge, we explored how to make our web application feel faster and more modern by using **Asynchronous Requests**. Instead of reloading the entire page for every action, we use the browser's `fetch()` API to send requests to the server in the background.

## 🚀 Key Concepts

### 1. The Fetch API
The `fetch()` function allows us to send HTTP requests (GET, POST, DELETE, etc.) from client-side JavaScript. It returns a **Promise** that resolves to the response.

### 2. Async Deletion
We implemented a "Delete" feature for products that doesn't require a page refresh:
- **Client-side**: A JavaScript function (`deleteProduct`) grabs the product ID and CSRF token, then sends a `DELETE` request.
- **Server-side**: An Express route handles the `DELETE` method and returns a JSON response instead of redirecting.
- **DOM Manipulation**: Once the server confirms success, the product element is removed from the DOM instantly.

## 🛠️ Implementation Details

### Client-side Logic (`public/js/admin.js`)
```javascript
fetch('/admin/product/' + productId, {
    method: 'DELETE',
    headers: {
        'csrf-token': csrf
    }
})
.then(result => result.json())
.then(data => {
    // Remove element from UI
    productElement.parentNode.removeChild(productElement);
})
.catch(err => console.log(err));
```

### Server-side Logic
- **Route**: `router.delete('/product/:productId', ...)`
- **Controller**: Deletes the product from the database and returns `res.status(200).json({ message: 'Success!' })`.

## 📈 Benefits
- **Better UX**: No jarring page flickers or reloads.
- **Efficiency**: Only the necessary data is exchanged.
- **Modern Feel**: Makes the app feel like a "Single Page Application" (SPA) in specific areas.

---
*Progressing through the Node.js journey, one async request at a time!* 🚀

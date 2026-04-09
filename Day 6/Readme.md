# Day 6: Working with Dynamic Data & Pug (MVC) 🚀

Welcome to Day 6 of the Node.js 30 Days Challenge! Today, we transition from static files to a robust **MVC (Model-View-Controller)** architecture using the **Pug** templating engine and file-based data persistence.

## 📝 Overview
In this module, we focus on decoupling our application logic into manageable layers:
- **Models**: For data management and persistence.
- **Views**: For rendering the user interface.
- **Controllers**: For handling request logic and connecting Models with Views.

## 🛠️ Key Concepts

### 1. Templating with Pug
We switched our view engine to Pug:
```javascript
app.set("view engine", "pug");
app.set("views", "views");
```
Pug uses a clean, indentation-based syntax and supports powerful features like **Template Inheritance** (`extends` and `block`) to keep our UI consistent.

### 2. File-Based Persistence (Model)
Instead of storing data in a temporary array, we now use a `Product` model that interacts with the file system:
- **Data Storage**: Products are saved to `data/products.json`.
- **Asynchronous Logic**: We use callbacks to handle file reading/writing without blocking the server.

### 3. Layouts & Blocks
We use a base layout (`layouts/main-layout.pug`) to manage our `<head>` and `<nav>`. Individual pages like `shop.pug` or `add-product.pug` simply extend this layout and fill in the `content` block.

## 📂 Project Structure
- `models/product.js`: Handles file saving and retrieval logic.
- `controllers/`: Contains logic for `admin.js`, `shop.js`, `cart.js`, and `error.js`.
- `routes/`: Express routers for different sections of the app.
- `views/`: Pug templates (.pug) organized by feature.
- `public/`: Static files (CSS and images).

## 🚀 How to Run
1. Navigate to this directory:
   ```bash
   cd "Day 6"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Visit `http://localhost:3000` to see the shop, and use the navigation to explore products, the cart, and the admin area!

---
*Onwards to Day 7!*

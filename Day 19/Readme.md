# Day 19: Pagination 🚀

Welcome to **Day 19**! As our database grows, fetching all products at once becomes inefficient and slow. Today, we implemented **Pagination** to load data in chunks, improving both performance and user experience.

---

## 🛠️ Why Pagination?

1.  **Performance**: Loading 1000 items at once consumes memory and increases load time.
2.  **Scalability**: Ensures the app remains fast as the dataset grows.
3.  **UX**: Users can navigate through pages rather than scrolling through an endless list.

---

## 📦 Implementation Logic

In Express/Mongoose, we use the `skip()` and `limit()` methods to fetch specific "windows" of data.

### 1. Controller Setup (`controllers/shop.js`)

We define how many items to show per page and calculate the offset.

```javascript
const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1; // Get page from query params
  let totalItems;

  Product.find()
    .countDocuments() // 1. Count total items for pagination math
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE) // 2. Skip previous pages
        .limit(ITEMS_PER_PAGE);           // 3. Limit to current page items
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        // Pagination data
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => next(err));
};
```

### 2. View Integration (`views/includes/pagination.ejs`)

We created a reusable pagination component to navigate between pages.

```html
<section class="pagination">
    <% if (currentPage !== 1 && previousPage !== 1) { %>
        <a href="?page=1">1</a>
    <% } %>
    
    <% if (hasPreviousPage) { %>
        <a href="?page=<%= previousPage %>"><%= previousPage %></a>
    <% } %>
    
    <a href="?page=<%= currentPage %>" class="active"><%= currentPage %></a>
    
    <% if (hasNextPage) { %>
        <a href="?page=<%= nextPage %>"><%= nextPage %></a>
    <% } %>
    
    <% if (lastPage !== currentPage && nextPage !== lastPage) { %>
        <a href="?page=<%= lastPage %>"><%= lastPage %></a>
    <% } %>
</section>
```

---

## ✅ Day 19 Learning Goals

-   **Skip & Limit**: Mastered database query modifiers for chunked data retrieval.
-   **Dynamic Math**: Calculated `hasNextPage`, `lastPage`, and offsets programmatically.
-   **Reusable UI**: Built a dynamic pagination navigation bar in EJS.
-   **Query Parameters**: Handled `?page=X` parameters in Express routes.

---

*Efficient data fetching is the backbone of high-performance web applications!*

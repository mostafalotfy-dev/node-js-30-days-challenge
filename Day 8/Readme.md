# Day 8: Introduction to Databases (SQL vs. NoSQL) 🗄️

Welcome to Day 8! As our application grows, storing data in simple JSON files becomes inefficient. Today, we explore the world of databases and compare the two main paradigms: **SQL** and **NoSQL**.

## 🚀 Why Move Away from the File System?
While files are easy to use for small projects, they have significant drawbacks for production apps:
- **Concurrency**: Files can't easily handle multiple users writing at the exact same time.
- **Performance**: Reading/writing the entire file for every small update is slow as data grows.
- **Relationships**: Linking data (e.g., Users to Orders) is manual and error-prone in JSON.

---

## 📊 SQL vs. NoSQL: The Big Comparison

| **ACID** | High standard for data integrity and transactions. | Varies, often prioritizes speed and scalability over strict consistency (BASE). |

---

## 📈 Scaling: Vertical vs. Horizontal

When your application grows and needs more power, you have two main ways to scale:

### 1. Vertical Scaling (Scale Up) ⬆️
*   **What it is**: Adding more power (CPU, RAM, SSD) to your **existing server**.
*   **How it works**: Like buying a bigger engine for your car.
*   **Pros**:
    *   Simpler to manage; no changes to application logic needed.
    *   Lowest latency since all data remains on one machine.
*   **Cons**:
    *   **Hard Limit**: You eventually reach a physical limit on how much RAM/CPU one server can hold.
    *   **Single Point of Failure**: If the server goes down, the whole app goes down.
    *   **Expensive**: High-end hardware costs grow exponentially.

### 2. Horizontal Scaling (Scale Out) ↔️
*   **What it is**: Adding **more servers** to your infrastructure and distributing the load.
*   **How it works**: Like adding more cars to a fleet to carry more passengers.
*   **Pros**:
    *   **Virtually Infinite**: You can keep adding more cheap commodity servers.
    *   **High Availability**: If one server fails, others can take over.
*   **Cons**:
    *   **Complex**: Requires a load balancer and more complex application logic.
    *   **Network Latency**: Communication between servers can introduce slight delays.

> [!TIP]
> **SQL** databases are traditionally built for **Vertical Scaling**, while **NoSQL** databases are designed from the ground up for **Horizontal Scaling** (Sharding).

---

### 🏛️ 1. SQL (Structured Query Language)
SQL databases like **MySQL**, **PostgreSQL**, and **SQLite** are built on the concept of relations.
- **Best for**: Applications requiring complex queries, multi-row transactions (e.g., Banking), and structured data where the schema doesn't change often.
- **Core Concept**: "Everything is a table."

### 🍃 2. NoSQL (Not Only SQL)
NoSQL databases like **MongoDB**, **Redis**, and **Cassandra** offer high flexibility.
- **Best for**: Rapid development, big data, real-time analytics, and data that naturally fits into hierarchical structures (like JSON).
- **Core Concept**: "Everything is a document."

---

## ⚖️ Strengths & Weaknesses

### SQL (Relational)
*   ✅ **Pros**:
    *   **Data Integrity**: ACID compliance ensures transactions are safe and data is consistent.
    *   **Standardized**: Uses a standard language (SQL) supported by almost all tools.
    *   **Joins**: Efficiently combines data from different tables.
*   ❌ **Cons**:
    *   **Scalability**: Mostly vertical (harder and more expensive to scale).
    *   **Rigidity**: Changing the schema for a large database can be slow and risky.

### NoSQL (Document-based)
*   ✅ **Pros**:
    *   **Flexibility**: No need for a fixed schema; perfect for evolving data models.
    *   **Scalability**: Designed for horizontal scaling (sharding) across many servers.
    *   **Speed**: High-speed read/write operations for large datasets.
*   ❌ **Cons**:
    *   **Atomicity**: Often lacks complex transaction support (though MongoDB is improving here).
    *   **Redundancy**: Data is often duplicated to avoid complex "joins", which can lead to inconsistency.

---

## 🎯 Typical Use Cases

*   **Choose SQL if**:
    *   You are building a financial system or an accounting app.
    *   You have complex relationships where data integrity is paramount.
    *   Your data structure is stable and won't change frequently.
*   **Choose NoSQL if**:
    *   You are building a real-time big data app or social media feed.
    *   You need to scale quickly to millions of users.
    *   You have unstructured or semi-structured data (like user-generated content).

---

## 🛠️ Practical Implementation: Moving to MySQL

Now that we understand the benefits of SQL, let's look at how we integrated it into our Shop application.

### 1. Installation
We use the `mysql2` package, which is a modern, fast MySQL driver for Node.js.
```bash
npm install --save mysql2
```

### 2. Database Connection Pool
Instead of opening and closing a single connection for every request, we use a **Connection Pool**. This maintains a set of open connections that can be reused.

In `util/database.js`:
```javascript
const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "node-complete",
    password: "your_password",
    port: 3306
});

module.exports = pool.promise();
```
> [!TIP]
> Calling `.promise()` allows us to use modern `async/await` or `.then()/.catch()` syntax instead of traditional callbacks.

### 3. SQL Schema
To store our products, we created a table with the following structure:
```sql
CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  price DOUBLE NOT NULL,
  description TEXT NOT NULL,
  imageUrl VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX id_UNIQUE (id ASC)
);
```

### 4. Updating the Model (`models/product.js`)
We refactored our `Product` class to use SQL queries. Instead of writing to a simple JSON file, we now execute `INSERT` and `SELECT` statements.

```javascript
  save() {
    return db.execute(
      "INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }
```

### 5. Handling Results in Controllers
Since `db.execute()` returns a Promise, we handle it in our controllers using `.then()`:

```javascript
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/"
      });
    })
    .catch(err => console.log(err));
};
```
> [!NOTE]
> `mysql2` returns an array where the first element (`rows`) contains the actual data from the database.

---

## 🛠️ What's Next?
In the coming days, we will transition our Shop app further from `products.json` to a real database to handle production-level traffic and data integrity!

---
*Stay tuned for Day 9!*

# Working with Mongoose 🐺

Welcome to Day 11! Today, we take our MongoDB skills to the next level by introducing **Mongoose**. While the native MongoDB driver is powerful, Mongoose provides a more structured, schema-based approach to interacting with our database, similar to how Sequelize worked for SQL.

---

## 🏗️ What is Mongoose?

**Mongoose** is an **ODM** (Object Data Modeling) library for MongoDB and Node.js. It acts as a wrapper around the native MongoDB driver, allowing us to define the structure of our documents (Schemas) and interact with them using standard JavaScript objects (Models).

### 🌟 Key Features

*   **Schema-Based**: Define exactly what fields your documents should have and their data types.
*   **Built-in Validation**: Ensure data integrity with required fields, min/max values, and custom validators.
*   **Type Casting**: Automatically converts data to the correct type (e.g., strings to Numbers).
*   **Query Building**: Use a chainable, intuitive API to build complex queries.
*   **Middleware**: Use hooks (pre/post) to run logic before or after saving, updating, or deleting.

---

## ⚖️ Native Driver vs. Mongoose

| Feature | Native MongoDB Driver | Mongoose (ODM) |
| :--- | :--- | :--- |
| **Structure** | Schema-less (Manual control) | Schema-based (Enforced structure) |
| **Data Types** | Flexible | Defined and Casted |
| **Validation** | Manual (In code) | Automatic (In Schema) |
| **Relationships** | Manual Manual (ObjectId/Lookup) | Simplified via `ref` and `populate` |
| **Code Style** | Lower-level / Verbose | Higher-level / Expressive |

---

## 🛠️ Core Concepts

### 1. The Schema
A **Schema** maps to a MongoDB collection and defines the shape of the documents within that collection. It specifies fields, types, and default values.

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  imageUrl: String
});
```

### 2. The Model
A **Model** is a wrapper for the Schema. It provides the interface for the database to create, query, update, and delete records.

```javascript
module.exports = mongoose.model('Product', productSchema);
```

---

## 🔌 Connecting with Mongoose

Mongoose simplifies connection management significantly. Instead of manually passing the client around, Mongoose maintains a global connection state.

```javascript
const mongoose = require('mongoose');

mongoose
  .connect('mongodb+srv://<user>:<password>@cluster.mongodb.net/node-complete')
  .then(result => {
    app.listen(3000);
  })
  .catch(err => console.log(err));
```

---

## ✅ Summary of Day 11 Goals
Today we will:
*   Install and set up Mongoose in our Express app.
*   Transition our native MongoDB models to Mongoose Schemas and Models.
*   Use Mongoose methods like `save()`, `find()`, `findById()`, and `findByIdAndRemove()`.
*   Explore static and instance methods.
*   Implement powerful data population for relationships.

---
*Time to bring structure to our NoSQL journey!*

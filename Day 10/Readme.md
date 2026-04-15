# Exploring MongoDB 🍃

Welcome to Day 10! After mastering Sequelize and SQL databases, it's time to dive into the world of **NoSQL**. Today, we transition from rigid schemas to the flexible, document-based architecture of **MongoDB**.

---

## 🏗️ What is MongoDB?

**MongoDB** is a popular, open-source **NoSQL** database. Unlike relational databases that use tables and rows, MongoDB stores data in flexible, JSON-like **documents**.

### 🌟 Key Concepts

*   **Document-Oriented**: Data is stored in BSON (Binary JSON) format.
*   **Schema-less**: No need to define a rigid structure beforehand. Each document can have different fields.
*   **Highly Scalable**: Designed for horizontal scaling and high performance.
*   **Rich Query Language**: Supports powerful indexing and aggregation pipelines.

---

## ⚖️ SQL vs. NoSQL (MongoDB)

| Feature | SQL (MySQL/Sequelize) | NoSQL (MongoDB) |
| :--- | :--- | :--- |
| **Data Model** | Tables / Rows / Columns | Collections / Documents / Fields |
| **Schema** | Rigid (Fixed structure) | Flexible (JSON-style) |
| **Relationships** | Joins and Foreign Keys | Embedding or Referencing |
| **Scaling** | Vertical (Bigger server) | Horizontal (More servers) |

---

## 🛠️ Core Terminology

*   **Database**: A container for collections.
*   **Collection**: A group of MongoDB documents (similar to a Table).
*   **Document**: A record in a MongoDB collection (similar to a Row).
*   **Field**: A key-value pair in a document (similar to a Column).

---

## 🔌 Connecting to MongoDB

To use MongoDB in Node.js, we use the official `mongodb` driver.

```javascript
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb://localhost:27017/node-complete'
  )
    .then(client => {
      console.log('Connected!');
      callback(client);
    })
    .catch(err => {
      console.log(err);
    });
};
```

---

## 📦 Managing Database Connections

Instead of connecting every time we run a query, we establish a connection once when our server starts and maintain a connection pool. We created a utility to store the active database instance, which can be retrieved whenever we need to perform an operation:

```javascript
let _db;

const getDb = () => {
  if (!_db) {
    throw new Error('No Database Found!');
  }
  return _db;
};
```

---

## 🆔 The `ObjectId`

In MongoDB, every document has a unique identifier stored in the `_id` field. MongoDB uses a special type called `ObjectId` for this field. When querying or updating documents based on their ID, we must convert the string ID into an `ObjectId` instance:

```javascript
const { ObjectId } = require('mongodb');

// Querying by ID
db.collection('products').findOne({ _id: new ObjectId(prodId) })
```

---

## 🔄 Implementing Actions (Native Driver)

Unlike Sequelize where models extend an ORM base class, we are using the native MongoDB driver. This means our models are standard JavaScript classes, and we explicitly define functions interacting with MongoDB collections:

*   **Saving/Updating:** `db.collection('products').insertOne(this)` or `updateOne(...)`
*   **Fetching All:** `db.collection('products').find().toArray()`
*   **Fetching One:** `db.collection('products').find({ _id: ... }).next()`
*   **Deleting:** `db.collection('products').deleteOne({ _id: ... })`

---

## ✅ Summary of Day 10
Today we learned:
*   Transitioning from SQL (Sequelize) to NoSQL (MongoDB).
*   Connecting our Express application to MongoDB using the native driver.
*   Implementing the Singleton pattern for managing the database connection.
*   Writing manual CRUD operations (Create, Read, Update, Delete) for Products and Users.
*   Understanding and working with MongoDB's `ObjectId` for mapping relationships and primary keys.

---
*Let's embrace the flexibility of NoSQL!*

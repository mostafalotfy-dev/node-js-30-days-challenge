# Day 18: File Uploads, File Management & PDF Generation 📂📄

Welcome to **Day 18**! In this lesson, we advanced our Express application by handling file uploads, managing files on the server (deletion), and generating dynamic PDF documents.

---

## 📦 File Uploads with Multer

**Multer** is a middleware for handling `multipart/form-data`, primarily used for uploading files.

### 1. Configuration (`app.js`)

In our project, we configure Multer with a specific **Storage Engine** and **File Filter**:

```javascript
const multer = require("multer");

// Define how and where files should be stored
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // Files will be stored in the 'images' folder
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using a timestamp + original name
    cb(null, new Date().toISOString().replace(/:/g, "") + "-" + file.originalname);
  }
});

// Define which file types are allowed
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true); // Accept file
  } else {
    cb(null, false); // Reject file
  }
};

// Initialize Multer
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));
```

### 2. Serving Static Files

To make uploaded images accessible via URL, we serve the `images` folder statically:

```javascript
app.use("/images", express.static(path.join(__dirname, "images")));
```

### 3. Handling Uploads in Controllers

When a file is uploaded, Multer attaches a `file` object to the `req`. We can then extract the path to store in our database.

```javascript
// controllers/admin.js
exports.postAddProduct = (req, res, next) => {
  const image = req.file; // Access the uploaded file
  if (!image) {
    // Handle error if file is missing or invalid type
  }
  const imageUrl = image.path; // The path to the file on the server
  
  const product = new Product({
    // ... other fields
    imageUrl: imageUrl
  });
  product.save();
};
```

---

## 🗑️ File Management (Deletion)

When a product is deleted or its image is updated, we should clean up the old file from the server to save space.

### Utility Helper (`util/file.js`)

```javascript
const fs = require("fs");

exports.deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
```

### Usage in Controller

```javascript
// controllers/admin.js
if (updatedImage) {
  fileHelper.deleteFile(product.imageUrl); // Delete old image
  product.imageUrl = updatedImage.path; // Set new path
}
```

---

## 📑 PDF Generation with PDFKit

We use **PDFKit** to generate invoices on-the-fly when a user requests one.

### Implementation Logic (`controllers/shop.js`)

```javascript
const PDFDocument = require("pdfkit");
const fs = require("fs");

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  // ... verify order ownership ...

  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join("data", "invoices", invoiceName);

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="' + invoiceName + '"');

  doc.pipe(fs.createWriteStream(invoicePath)); // Save to server
  doc.pipe(res); // Stream to client

  doc.fontSize(26).text("Invoice", { underline: true });
  doc.text("-----------------------");
  // ... loop through order products ...
  doc.fontSize(14).text(`Total Price: $${totalPrice}`);

  doc.end();
};
```

---

## ✅ Day 18 Learning Goals

- **Multer**: Mastered file upload configuration, storage engines, and file filtering.
- **Static Assets**: Learned how to serve uploaded files correctly.
- **File System**: Implemented automated file deletion using Node's `fs` module.
- **PDF Generation**: Used `pdfkit` to generate and stream dynamic PDF documents directly to the browser.

---

*Managing files and generating documents are core features for any e-commerce or business application!*
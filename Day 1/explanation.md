# 🛠️ Modular Node.js Server Explanation

This document explains the multi-file architecture of the Node.js server. The application is split into two files to separate the **server configuration** from the **routing logic**, making the code more maintainable.

---

## 🏗️ 1. The Entry Point: `app.js`
The `app.js` file is the starting point of the application. Its job is to create the server and start listening for traffic.

```javascript
const http = require("http");
const routes = require("./routes"); // Imports the logic from routes.js

const server = http.createServer(routes); // Uses the imported handler

server.listen(3000); // Listens on Port 3000
```

- **`const routes = require("./routes")`**: This line imports the `requestHandler` function from the `routes.js` file.
- **`http.createServer(routes)`**: Instead of writing the logic directly inside the server creation, we pass the `routes` function to handle all incoming requests.

---

## 🚦 2. The Logic: `routes.js`
The `routes.js` file contains the core logic for handling requests (routing, data streaming, and file system operations).

### 🏷️ Core Exports
The file uses `module.exports = requestHandler;` at the end. This makes the function available to be `require`'d by other files like `app.js`.

### 🛣️ Routing Breakdown

#### 🏠 The Home Route (`/`)
When a user visits the root URL, we send back a basic HTML form.
```javascript
if (url === "/") {
  res.write("<html>...");
  res.write("<body><form action='/message' method='POST'>...</form></body>");
  return res.end();
}
```

#### ✉️ Handling Form Submissions (`/message` & POST)
Node.js treats incoming request bodies as **streams**. This means data arrives in small pieces (chunks) rather than all at once.

1.  **Chunk Accumulation**: We listen for the `data` event to collect chunks into an array.
    ```javascript
    req.on("data", (chunk) => { body.push(chunk); });
    ```
2.  **Parsing & Output**: Once the data has finished arriving (`end` event), we concatenate the chunks and extract the message.
    ```javascript
    const parsedBody = Buffer.concat(body).toString();
    const message = parsedBody.split("=")[1];
    ```
3.  **File Writing & Redirection**: We use `fs.writeFile` to save the message to `message.txt`. Once saved, we set a `302` status code and a `Location` header to redirect the user back home.
    ```javascript
    fs.writeFile("./message.txt", message, (err) => {
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
    ```

#### 🌐 Default Response
If no other routes match, the server sends a default "Hello" message to the browser.
```javascript
res.setHeader("Content-Type", "text/html");
res.write("<body><h1>Hello from Node.js Server!</h1></body>");
res.end();
```

---

## 💡 Key Benefits of This Structure
- **Readability**: Each file has a clear, singular responsibility.
- **Scalability**: As the app grows, you can easily add more route files without cluttering `app.js`.
- **Reusability**: Core logic can be tested independently of the server setup.

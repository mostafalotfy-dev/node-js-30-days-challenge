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

## 🔍 Finding Syntax & Runtime Errors

Understanding the difference between syntax and runtime errors is crucial for debugging your Node.js applications.

### 🛑 1. Syntax Errors
A **Syntax Error** occurs when your code violates the rules of the JavaScript language (e.g., a missing bracket, a typo in a keyword, or an unclosed string).
- **When it happens**: Node.js detects these **before** executing any code.
- **What happens**: The application fails to start, and you will see a `SyntaxError` in your terminal.
- **How to find it**: Look at the terminal output. Node.js will point to the exact file and line number where the "parsing" failed.

### 🏃 2. Runtime Errors
A **Runtime Error** occurs while the application is already running (e.g., trying to call a function that doesn't exist, or accessing a property of `undefined`).
- **When it happens**: Only when that specific block of code is executed.
- **What happens**: The application might crash, or a specific request might fail. You will see a stack trace (e.g., `ReferenceError`, `TypeError`).
- **How to find it**: The terminal will show a **Stack Trace**. The top-most line that refers to your own files (e.g., `at Object.<anonymous> (D:\...\app.js:12:3)`) tells you exactly where the crash happened.

### 🧐 3. Logical Errors
A **Logical Error** occurs when the code runs without crashing but produces the **wrong result** (e.g., a user is redirected to the wrong page, or data is saved incorrectly).
- **When it happens**: During execution, but subtly.
- **What happens**: The program doesn't crash, but it behaves unexpectedly.
- **How to find it**: These are the hardest to find! You must compare the **expected** output with the **actual** output by testing your app.

### 🛠️ Debugging Tips
1.  **Read the Stack Trace**: Don't ignore the wall of text in the terminal! Look for the first line that mentions your project's file path.
2.  **Console Logging**: Use `console.log()` to inspect variables and verify which parts of your code are being reached.
3.  **Process Monitoring**: Use a tool like **Nodemon** (`npm install -g nodemon`) to automatically restart your server whenever you fix an error.

### ✅ How to Fix Them
- **For Syntax Errors**:
  - Go to the line number indicated in the terminal.
  - Check for missing `}`, `)`, or `,`.
  - Ensure all strings are closed with matching quotes (`'` or `"`).
- **For Runtime Errors**:
  - Use `console.log(variableName)` before the failing line to check its value.
  - If a variable is `undefined`, trace back where it should have been assigned.
  - Wrap risky code (like file operations or JSON parsing) in a `try { ... } catch (err) { ... }` block to handle errors gracefully without crashing the server.
- **For Logical Errors**:
  - Use `console.log()` to check if values at each step match your expectations.
  - Use a **debugger** (like the one in VS Code) to pause execution and inspect the state of your app line-by-line.
  - "Rubber Duck Debugging": Explain your logic out loud to someone (or a rubber duck!) to find where your reasoning might be flawed.

---

## 💡 Key Benefits of This Structure
- **Readability**: Each file has a clear, singular responsibility.
- **Scalability**: As the app grows, you can easily add more route files without cluttering `app.js`.
- **Reusability**: Core logic can be tested independently of the server setup.

# 🚀 Node.js Fundamentals: Day 2 - Better Routing & Structure

Welcome to **Day 2** of the Node.js learning journey! This project demonstrates how to build a basic web server from scratch with a **modular architecture** and includes a guide for debugging common JavaScript errors.

---

## 🛠️ Features
- **Modular Code**: Separating server configuration from request logic using `module.exports` and `require`.
- **Manual Routing**: Handles different URLs (`/` and `/message`) and HTTP methods (`GET` and `POST`).
- **Data Streaming**: Processes incoming request bodies using Node.js `Buffer` and `Stream` APIs.
- **File System Interaction**: Dynamically writes user input into a local text file (`message.txt`).
- **Redirection**: Automatically redirects users back to the home page after a successful form submission.

---

## 📂 Project Structure
- `app.js`: The main server entry point.
- `routes.js`: Contains the logic for routes, requests, and data handling.
- `explanation.md`: A detailed breakdown of the modular server structure and a **debugging guide**.
- `message.txt`: (Auto-generated) Stores the messages sent via the web form.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** installed on your machine. You can check by running:
```bash
node -v
```

### 2. Initializing a New Project
To start a new Node.js project from scratch, use the following command to create a `package.json` file:
```bash
npm init
```
*(Press Enter for all defaults or use `npm init -y` to skip questions).*

### 3. Installing 3rd Party Packages
You can install external libraries (like `nodemon` for auto-restarts) using `npm install`:
```bash
# General installation
npm install <package-name>

# Example: Installing nodemon as a development dependency
npm install --save-dev nodemon
```

### 4. Running the Server
Open your terminal in this directory and run:
```bash
node app.js
```
*(If you installed `nodemon`, you can run `npx nodemon app.js` to automatically restart the server on file changes).*

### 5. Basic Usage
1. Open your browser and navigate to `http://localhost:3000`.
2. You will see a simple input form.
3. Type a message and click **Send**.
4. The server will redirect you back, and a `message.txt` file will be created/updated with your message.

### 6. 🐞 Using the Debugger
Instead of using `console.log` everywhere, use the VS Code debugger to pause execution and inspect your code:

1.  **Set a Breakpoint**: Click the margin to the left of the line number in `app.js` or `routes.js`. A red dot will appear.
2.  **Start Debugging**: 
    - Go to the **Run and Debug** tab in VS Code.
    - Click **"Run and Debug"** and select **"Node.js"**.
3.  **Inspect State**: The execution will pause at your red dot, allowing you to hover over variables to see their current values.

---

## 🔥 Learning Objectives
- **Modular Design**: Learn how to split your code into reusable files.
- **Node.js Core Modules**: Master the `http` and `fs` modules.
- **Request/Response Lifecycle**: Understand how Node.js handles data streams.
- **Debugging Mastery**: Learn to find and fix **Syntax**, **Runtime**, and **Logical** errors.

---

## 📖 Detailed Explanation
For a deep dive into the code and the debugging guide, please refer to the [explanation.md](./explanation.md) file.

---

## 🎬 Wrap Up
Congratulations on completing **Day 2**! You've moved beyond a single-file server and mastered the fundamentals of professional Node.js development.

### What you've achieved:
- [x] **Modularized** your code for better maintainability.
- [x] Learned how to use **3rd party packages** like `nodemon`.
- [x] Mastered **debugging** techniques for Syntax, Runtime, and Logical errors.
- [x] Leveraged the **VS Code Debugger** to inspect code execution.

Next up, we'll dive into **Express.js** to see how frameworks can simplify the routing logic we've built manually! 🚀

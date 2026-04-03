# 🚀 Node.js Fundamentals: Day 1 - Simple HTTP Server

Welcome to **Day 1** of the Node.js learning journey! This project demonstrates how to build a basic web server from scratch using Node.js's core modules, without relying on any external frameworks like Express.

---

## 🛠️ Features
- **Manual Routing**: Handles different URLs (`/` and `/message`) and HTTP methods (`GET` and `POST`).
- **Data Streaming**: Processes incoming request bodies using Node.js `Buffer` and `Stream` APIs.
- **File System Interaction**: Dynamically writes user input into a local text file (`message.txt`).
- **HTTP Responses**: Manually constructs HTML responses and sets headers (e.g., `Content-Type`, `Location`).
- **Redirection**: Automatically redirects users back to the home page after a successful form submission.

---

## 📂 Project Structure
- `app.js`: The main server entry point.
- `routes.js`: Contains the logic for routes, requests, and data handling.
- `explanation.md`: A detailed breakdown of the modular server structure and core logic.
- `message.txt`: (Auto-generated) Stores the messages sent via the web form.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** installed on your machine. You can check by running:
```bash
node -v
```

### 2. Running the Server
Open your terminal in this directory and run:
```bash
node app.js
```

### 3. Usage
1. Open your browser and navigate to `http://localhost:3000`.
2. You will see a simple input form.
3. Type a message and click **Send**.
4. The server will redirect you back, and a `message.txt` file will be created/updated with your message.

---

## 🔥 Learning Objectives
- Understanding the **Response/Request** lifecycle.
- Working with **Node.js Streams** (`req.on('data', ...)`).
- Managing **Asynchronous Callbacks** with the `fs` module.
- Basic **Routing Logic** in pure Node.js.

---

## 📖 Detailed Explanation
For a deep dive into every single line of code, please refer to the [explanation.md](./explanation.md) file.

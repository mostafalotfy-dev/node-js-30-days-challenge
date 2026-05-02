# Day 22: Introduction to REST APIs

Today's focus is on building REST APIs using Node.js and Express. REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on a stateless, client-server, cacheable communications protocol — in almost all cases, the HTTP protocol.

## Key Concepts Covered

1. **REST APIs vs Web Applications**:
   - Web applications return HTML pages that are rendered by the browser.
   - REST APIs return raw data (usually in JSON format) which can be consumed by any client, such as a Single Page Application (SPA), a mobile app, or another server.

2. **Parsing JSON Requests**:
   - In traditional web apps, form data is sent as `application/x-www-form-urlencoded`.
   - In REST APIs, data is frequently sent as `application/json`.
   - We use the `body-parser` middleware to parse incoming JSON payloads:
     ```javascript
     const bodyParser = require("body-parser");
     app.use(bodyParser.json());
     ```

3. **Returning JSON Responses**:
   - Instead of rendering a view using `res.render()`, REST APIs send back JSON data using `res.json()`.
   - `res.json()` automatically sets the correct `Content-Type: application/json` header and converts the provided JavaScript object or array into a JSON string.
   - Example endpoint:
     ```javascript
     app.post("/posts", (req, res, next) => {
       const title = req.body.title;
       const content = req.body.content;
       
       res.json({
         message: "Post created successfully",
         post: { title: title, content: content }
       });
     });
     ```

## How to Test the API

Since we don't have frontend views, you will need a tool to send HTTP requests to test the API. Some popular tools include:
- **Postman**: A popular GUI application for API testing.
- **cURL**: A command-line tool for making HTTP requests.
- **VS Code Extensions**: E.g., Thunder Client or REST Client.

**Example using cURL:**
```bash
curl -X POST http://localhost:8080/posts \
-H "Content-Type: application/json" \
-d '{"title": "My First Post", "content": "This is the content of the post."}'
```

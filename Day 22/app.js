const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.post("/posts", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  console.log(title, content);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  req.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization"); 
  res.json({
    message: "Post 1 successfully",
    post: {
      title: title,
      content: content,
    },
  });
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});

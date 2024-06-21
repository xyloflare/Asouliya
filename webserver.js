const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const path = require("node:path");

app.use(cors());

app.use((req, res, next) => {
  if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
    next();
  } else {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  }
});
app.use("/", express.static(path.join(__dirname, "dist")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

import express from "express";
const app = express();
import cors from "cors";
const port = 5000;
import { join } from "node:path";

app.use(cors());

app.use((req, res, next) => {
  if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
    next();
  } else {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    res.sendFile(join(__dirname, "dist", "index.html"));
  }
});
app.use("/", express.static(join(__dirname, "dist")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

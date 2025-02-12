import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express();
const port = 1234;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Raspberry Displayer");
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.get("/images", (_req, res) => {
  const uploadDir = path.join(__dirname, "../uploads/");
  try {
    const files = fs.readdirSync(uploadDir)
    res.send(files);
  } catch (error) {
    console.log(error);
  };
});

app.post("/upload-image", (req, res) => {
});

app.listen(port, () => {
  console.log(`[server] running on port: ${port}`);
});

import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express();
const port = 1234;

const storage = multer.diskStorage({
  destination: function(_req, _res, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function(_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage })

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

app.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(401).send("No file uploaded.");
  }
  res.send({
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
});

app.listen(port, () => {
  console.log(`[server] running on port: ${port}`);
});

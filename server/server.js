import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import multer from "multer";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));

const storage = multer.diskStorage({
  destination: function(_req, _res, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function(_req, file, cb) {
    cb(null, Date.now().toString(36) + "-" + file.originalname);
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
    const imageExtensions = /\.(jpg|jpeg|png)$/i;
    const imageFiles = files.filter(filename => {
      return imageExtensions.test(filename);
    });
    res.send(imageFiles);
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

// TODO: refactor this hell... it works tho ;-;
app.delete("/delete-images", (req, res) => {
  const { filenames } = req.body;

  if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
    return res.status(400).send("No filenames provided or invalid format.");
  }

  const errors = [];
  const deletedFiles = [];

  filenames.forEach((filename) => {
    const filePath = path.join(__dirname, "../uploads", filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        errors.push(`File not found: ${filename}`);
      } else {
        fs.unlink(filePath, (err) => {
          if (err) {
            errors.push(`Error deleting file: ${filename}`);
          } else {
            deletedFiles.push(filename);
          }

          if (deletedFiles.length + errors.length === filenames.length) {
            if (errors.length > 0) {
              res.status(500).json({ deletedFiles, errors });
            } else {
              res.json({ deletedFiles });
            }
          }
        });
      }
    });
  });
});

app.post("/open-slideshow", (_req, res) => {
  exec(`firefox --kiosk ${process.env.HOST}:${PORT}/slideshow.html`);
  res.status(200);
});

app.listen(PORT, () => {
  console.log(`[server] running on port: ${PORT}`);
});

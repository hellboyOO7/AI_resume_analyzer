const express = require("express");
const multer = require("multer");
const path = require("path");
const { analyzeResume } = require("../controller/analyze.controller");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: "./src/upload",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"));
    }
  },
});

router.post("/", upload.single("resume"), analyzeResume);

module.exports = router;

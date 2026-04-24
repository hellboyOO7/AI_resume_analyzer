require("dotenv").config();
const express = require("express");
const cors = require("cors");
const analyzeRoutes = require("./src/routes/analyze.routes");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5174",
  "https://ai-resume-analyzer-ashen-sigma.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use("/api/analyze", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

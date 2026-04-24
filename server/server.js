require("dotenv").config();
const express = require("express");
const cors = require("cors");
const analyzeRoutes = require("./src/routes/analyze.routes");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "https://ai-resume-analyzer-ashen-sigma.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

app.use("/api/analyze", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

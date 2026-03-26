require("dotenv").config();
const express = require("express");
const cors = require("cors");
const analyzeRoutes = require("./src/routes/analyze.routes");

const app = express();
const PORT = process.env.PORT;
app.use(cors({
  origin: "https://ai-resume-analyzer-1-gj5t.onrender.com",
  credentials: true
}));
app.use(express.json());

app.use("/api/analyze", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

const fs = require("fs/promises");
const pdfParse = require("pdf-parse");
const { analyzeWithGroq } = require("../services/groqService");

exports.analyzeResume = async (req, res, next) => {
  let filePath;

  try {
    // ✅ Validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    filePath = req.file.path;

    // ✅ Async read (non-blocking)
    const dataBuffer = await fs.readFile(filePath);

    const pdfData = await pdfParse(dataBuffer);
    let resumeText = pdfData.text;

    const cache = new Map();
    const hash = resumeText.slice(0, 100);

    if (cache.has(hash)) {
      return res.json(cache.get(hash));
    }

    // ✅ Trim text (performance optimization)
    resumeText = resumeText.slice(0, 3000);

    // ✅ AI call
    const aiRawResponse = await analyzeWithGroq(resumeText);

    // ✅ Safer JSON extraction
    const jsonMatch = aiRawResponse.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const parsedResult = JSON.parse(jsonMatch[0]);
    if (!parsedResult.skills || !Array.isArray(parsedResult.skills)) {
      parsedResult.skills = [];
    }

    // ✅ Normalize score
    const rawScore = parsedResult.score || 0;
    parsedResult.score =
      rawScore <= 10 ? Math.round(rawScore * 10) : Math.round(rawScore);

    res.status(200).json({
      success: true,
      result: parsedResult,
    });
  } catch (error) {
    console.error("ERROR:", error);
    next(error); // ✅ pass to global handler
  } finally {
    // ✅ ALWAYS delete file (even if error occurs)
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn("File cleanup failed:", err.message);
      }
    }
  }
};

const fs = require("fs");
const pdfParse = require("pdf-parse");
const { analyzeWithGroq } = require("../services/groqService");

exports.analyzeResume = async (req, res) => {
  try {
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer, {
      max: 0,
    });

    const resumeText = pdfData.text;

    const aiRawResponse = await analyzeWithGroq(resumeText);

    // Remove markdown formatting if exists
    const cleaned = aiRawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedResult = JSON.parse(cleaned);

    // NORMALIZE SCORE HERE
    const rawScore = parsedResult.score || 0;

    const finalScore =
      rawScore <= 10 ? Math.round(rawScore * 10) : Math.round(rawScore);

    parsedResult.score = finalScore; // overwrite score

    // Delete uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      result: parsedResult,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

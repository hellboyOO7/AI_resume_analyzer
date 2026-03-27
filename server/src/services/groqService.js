const axios = require("axios");

exports.analyzeWithGroq = async (resumeText) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are a professional ATS resume analyzer.

STRICT RULES:
- Detect the domain first.
- Do NOT assume technical roles.
- Return ONLY valid JSON.
- No explanation, no markdown, no extra text.
- Ensure JSON is properly formatted.
            `,
          },
          {
            role: "user",
            content: `
Analyze this resume and return STRICT JSON:

{
  "domain": "",
  "score": number (0-100),
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": [],
  "atsCompatibility": "Good | Moderate | Poor"
}

Resume:
${resumeText}
            `,
          },
        ],
        temperature: 0.1, // ✅ more consistent
        max_tokens: 800, // ✅ reduce cost
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // ✅ 10s timeout
      }
    );

    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Invalid response from Groq API");
    }

    return content;
  } catch (error) {
    console.error("Groq API Error:", error.message);

    throw new Error("AI analysis failed. Please try again.");
  }
};

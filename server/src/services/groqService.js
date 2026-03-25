const axios = require("axios");

exports.analyzeWithGroq = async (resumeText) => {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a professional ATS resume analyzer.

IMPORTANT RULES:
- Do NOT assume the resume is for a technical role.
- First detect the domain/industry of the resume.
- Then analyze it according to THAT domain.
- If non-technical, do NOT suggest programming skills.
- Return ONLY valid JSON.
          `,
        },
        {
          role: "user",
          content: `
Analyze this resume.

Step 1: Detect the domain (e.g., Software Development, Marketing, HR, Finance, Sales, Education, Design, etc.)

Step 2: Evaluate based on that domain and return JSON in this format:

{
  "domain": "",
  "score": number,
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
      temperature: 0.2,
      max_tokens: 1200,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
};

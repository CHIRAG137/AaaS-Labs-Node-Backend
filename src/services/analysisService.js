const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a prompt for code security analysis.
 * @param {string} codeSnippet - The code to analyze.
 * @param {string} language - The programming language of the code (optional).
 * @returns {string} The formatted prompt.
 */
function generatePrompt(codeSnippet, language = "") {
  return `
You are a security analysis expert. Analyze the following code and provide top 10 OWASP potential security vulnerabilities in JSON format. Each vulnerability should have a severity level (HIGH, MEDIUM, LOW).

Return the response in this exact JSON structure:
{
  "vulnerabilities": [
    {
      "title": "string",
      "severity": "string",
      "description": "string",
      "impact": "string",
      "remediation": "string"
    }
  ]
}

Code to analyze:
\`\`\`${language || "text"}
${codeSnippet}
\`\`\`

Provide your response as a valid JSON object only, with no additional text or explanations.`;
}

/**
 * Analyzes a given code snippet for security vulnerabilities.
 * @param {string} codeSnippet - The code to analyze.
 * @param {string} language - The programming language of the code (optional).
 * @returns {Promise<string>} The security analysis report.
 */
async function analyzeCode(codeSnippet, language = "") {
  const prompt = generatePrompt(codeSnippet, language);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in analysisService:", error);
    throw error;
  }
}

module.exports = { analyzeCode };

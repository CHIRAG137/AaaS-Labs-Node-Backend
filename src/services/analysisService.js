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
function generateCodeAnalysisPrompt(codeSnippet, language = "") {
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
  const prompt = generateCodeAnalysisPrompt(codeSnippet, language);

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

/**
 * Detects programming language based on file extension.
 * @param {string} filePath - The file path.
 * @returns {string} - Detected language.
 */
function detectLanguage(filePath) {
  const extensionMap = {
    js: "JavaScript",
    json: "JSON",
    py: "Python",
    ts: "TypeScript",
    java: "Java",
    cpp: "C++",
    cs: "C#",
    go: "Go",
    php: "PHP",
    rb: "Ruby",
  };

  const ext = filePath.split(".").pop();
  return extensionMap[ext] || "Unknown";
}

/**
 * Generates a dynamic prompt for AI analysis.
 * @param {Array} codeFiles - List of code files (path + content).
 * @param {string} question - User's question.
 * @returns {string} - The formatted prompt.
 */
function generateAnswerCodeQueriesPrompt(codeFiles, question = "") {
  let formattedCode = codeFiles
    .map((file) => {
      const language = detectLanguage(file.path);
      return `### File: ${file.path} (${language})\n\`\`\`${language}\n${file.content}\n\`\`\`\n`;
    })
    .join("\n");

  // TODO: Improvise the prompt
  return `
You are a software analysis expert. Analyze the following codebase consisting of multiple files.

${
  question
    ? `User's question: ${question}`
    : "Provide an overview of what this code does."
}

Codebase:
${formattedCode}

Respond in structured JSON format:
{
  "summary": "Brief summary of the entire codebase",
  "key_features": ["Feature 1", "Feature 2", "Feature 3"],
  "potential_issues": ["Issue 1", "Issue 2"],
  "best_practices": ["Suggestion 1", "Suggestion 2"]
}
If security concerns are relevant, include them under "potential_issues". If the user asks a specific question, answer it concisely.
  `;
}

/**
 * Analyzes multiple code files using OpenAI API.
 * @param {Array} codeFiles - List of code files.
 * @param {string} question - User's question.
 * @returns {Promise<string>} - The analysis report.
 */
async function getQueryAboutCode(codeFiles, question = "") {
  const prompt = generateAnswerCodeQueriesPrompt(codeFiles, question);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a coding assistant." },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in analysisService:", error);
    throw error;
  }
}

module.exports = { analyzeCode, getQueryAboutCode };

const axios = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

exports.generateFlowChart = async (text) => {
  try {
    const prompt = `Based on these text, generate a Mermaid.js flowchart diagram showing the system architecture:
        ${text}
        
        Include:
        1. Main components and their relationships
        2. Data flow
        3. External services
        4. Key processes
        
        Respond only with the Mermaid.js diagram code, no explanations.`;

    const response = await axios.post(
      OPENAI_URL,
      {
        model: "gpt-4",
        messages: [{ role: "system", content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate Mermaid.js diagram");
  }
};

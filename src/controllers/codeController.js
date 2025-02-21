const analysisService = require("../services/analysisService");

exports.analyzeCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }
    const analysisReport = await analysisService.analyzeCode(code, language);
    res.json({ analysis: analysisReport });
  } catch (error) {
    console.error("Error analyzing code:", error);
    res.status(500).json({ error: "Failed to analyze code" });
  }
};

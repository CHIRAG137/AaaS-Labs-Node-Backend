const githubService = require("../services/githubService");

/**
 * Get GitHub repositories of the authenticated user
 * @route GET /api/github/repos
 */
exports.getUserRepositories = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const repos = await githubService.getUserRepos(req.user.id);
    res.json(repos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const axios = require("axios");
const User = require("../models/User");

/**
 * Fetch GitHub repositories of an authenticated user
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<Array>} - List of repositories
 */
exports.getUserRepos = async (userId) => {
  const user = await User.findById(userId);

  if (!user || !user.accessToken) {
    throw new Error("User not authenticated or missing access token");
  }

  const response = await axios.get("https://api.github.com/user/repos", {
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
    params: {
      visibility: "all", // ✅ Fetch both public & private repositories
      per_page: 100,
    },
  });

  return response.data;
};

/**
 * Recursively fetch all files from a GitHub repository
 * @param {string} owner - Repository owner (GitHub username)
 * @param {string} repo - Repository name
 * @param {string} path - Path in the repo (default: root)
 * @param {string} accessToken - User's GitHub OAuth token
 * @returns {Promise<Array>} - List of files with content
 */
const fetchRepoContents = async (owner, repo, path = "", accessToken) => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    let files = [];

    for (const item of response.data) {
      if (item.type === "file") {
        // Fetch file content
        const fileContent = await axios.get(item.download_url);
        files.push({
          path: item.path,
          content: fileContent.data,
        });
      } else if (item.type === "dir") {
        // Recursively fetch directory contents
        const subFiles = await fetchRepoContents(
          owner,
          repo,
          item.path,
          accessToken
        );
        files = files.concat(subFiles);
      }
    }

    return files;
  } catch (error) {
    console.error(
      "Error fetching repository contents:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch repository contents");
  }
};

module.exports = { fetchRepoContents };

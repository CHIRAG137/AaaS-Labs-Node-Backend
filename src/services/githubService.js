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
  });

  return response.data; // Return repositories list
};

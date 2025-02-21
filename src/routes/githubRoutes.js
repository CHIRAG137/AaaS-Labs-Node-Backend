const express = require("express");
const { getUserRepositories } = require("../controllers/githubController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/repos", isAuthenticated, getUserRepositories);

module.exports = router;

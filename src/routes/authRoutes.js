const express = require("express");
const {
  githubAuth,
  githubAuthCallback,
  getCurrentUser,
  logoutUser,
} = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const { FRONTEND_URL } = require("../lib/constant");

const router = express.Router();

router.get("/github", githubAuth);
router.get("/github/callback", githubAuthCallback, (req, res) => {
  res.redirect(`${FRONTEND_URL}/dashboard`);
});
router.get("/user", isAuthenticated, getCurrentUser);
router.get("/logout", logoutUser);

module.exports = router;

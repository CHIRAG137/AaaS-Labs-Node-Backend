const express = require("express");
const {
  githubAuth,
  githubAuthCallback,
  getCurrentUser,
  logoutUser,
} = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/github", githubAuth);
router.get("/github/callback", githubAuthCallback, (req, res) => {
  res.redirect("/profile"); // TODO: Redirect to a frontend profile page after login
});
router.get("/user", isAuthenticated, getCurrentUser);
router.get("/logout", logoutUser);

module.exports = router;

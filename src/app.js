const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const githubRoutes = require("./routes/githubRoutes");
const codeRoutes = require("./routes/codeRoutes");
const flowchartRoutes = require("./routes/flowChartRoutes");
const { FRONTEND_URL } = require("./lib/constant");

const app = express();

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Middleware
app.use(cors({ origin: `${FRONTEND_URL}`, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Logging
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/code", codeRoutes);
app.use('/api/flowchart', flowchartRoutes);

module.exports = app;

// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");
const path = require("path");
const cors = require("cors");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "routes", "uploads")));
// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

//routes
const wineRoutes = require("./routes/wine.routes");
app.use("/api/wines", wineRoutes);

// app.use("/api", require("./routes"));
app.use("/api", require("./routes/review.routes"));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;

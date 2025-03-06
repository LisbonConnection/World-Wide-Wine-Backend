const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User.model.js");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
mongoose
  .connect("mongodb://localhost:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/test", (req, res) => {
  res.send("Server is working!");
});

app.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const user = new User({ email, password, name });
    await user.save();

    const userResponse = { ...user.toObject(), password: undefined };
    res
      .status(201)
      .json({ message: "User registered successfully", user: userResponse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    const userResponse = { ...user.toObject(), password: undefined };
    res.status(200).json({ message: "Login successful", user: userResponse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "This route does not exist." });
});

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = 5005;


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

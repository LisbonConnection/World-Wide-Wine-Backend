const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./user.model");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

app.use(express.json());

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({ email, password, name });
    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});



// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

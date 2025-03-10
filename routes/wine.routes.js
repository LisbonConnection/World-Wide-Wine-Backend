const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const app = express();
const { isAuthenticated } = require("../middleware/jwt.middleware");

const Wine = require("../models/Wine.model");
const Review = require("../models/Review.model");

// Specify the folder for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

//create a wine
router.post("/", isAuthenticated, upload.single("image"), (req, res, next) => {
  const {
    wineName,
    varietalName,
    // image,
    region,
    price,
    description,
    reviewAverage,
  } = req.body;

  const image = req.file ? `/uploads/${req.file.filename}` : null;

  Wine.create({
    wineName,
    varietalName,
    image,
    region,
    price,
    description,
    reviewAverage,
  })
    .then((wineFromDB) => {
      res.status(201).json(wineFromDB);
    })
    .catch((error) => {
      console.log("Error while creating the wine", error);
      res.status(500).json({ message: "Error while creating the wine" });
    });
});

//Retrieve all wines
router.get("/", (req, res, next) => {
  Wine.find()
    .populate("reviewAverage")
    .then((wineFromDB) => {
      res.json(wineFromDB);
    })
    .catch((error) => {
      console.log("Error while getting the wines", error);
      res.status(500).json({ message: "Error while getting the wines" });
    });
});

//search wine
router.get("/search", isAuthenticated, (req, res) => {
  const { text } = req.query;

  console.log("query:", req.query);
  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  Wine.find({
    wineName: { $regex: text, $options: "i" },
  })
    .then((wines) => {
      if (wines.length === 0) {
        return res.status(404).json({ message: "No wines found" });
      }
      res.status(200).json(wines);
    })
    .catch((error) => {
      console.error("Error searching for wines:", error);
      res.status(500).json({ message: "Error searching for wines" });
    });
});

//Retrieve a specific wine
router.get("/:wineId", (req, res, next) => {
  const { wineId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(wineId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Wine.findById(wineId)
    .populate("reviewAverage")
    .then((wineFromDB) => {
      res.status(200).json(wineFromDB);
    })
    .catch((error) => {
      console.log("Error retrieving the wine", error);
      res.status(500).json({ message: "Error retrieving the wine" });
    });
});

//Update a specific wine
router.put("/:wineId", isAuthenticated, (req, res, next) => {
  const { wineId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(wineId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Wine.findByIdAndUpdate(wineId, req.body, { new: true })
    .then((wineFromDB) => {
      res.status(200).json(wineFromDB);
    })
    .catch((error) => {
      console.log("Error while updating the wine", error);
      res.status(500).json({ message: "Error while updating the wine" });
    });
});

//Delete a specific wine
router.delete("/:wineId", isAuthenticated, (req, res, next) => {
  const { wineId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(wineId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Wine.findByIdAndDelete(wineId)
    .then(() => {
      res.json({ message: `wine with ${wineId} deleted succesfully` });
      console.log(wineId);
    })
    .catch((error) => {
      console.log("Error while deleting the wine", error);
      res.status(500).json({ message: "Error while deleting the wine" });
    });
});

module.exports = router;

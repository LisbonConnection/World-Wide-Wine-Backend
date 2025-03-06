const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware");

const Review = require("../models/Review.model");
const Wine = require("../models/Wine.model");

router.post("/reviews", isAuthenticated, (req, res, next) => {
  const { rating, wineId } = req.body;

  Review.create({
    rating,
    wine: wineId,
  })
    .then((reviewFromDb) => {
      return Wine.findByIdAndUpdate(
        wineId,
        {
          $push: { reviewAverage: reviewFromDb._id },
        },
        { new: true }
      );
    })
    .then((reviewFromDb) => {
      return Wine.findByIdAndUpdate(
        wineId,
        { $push: { reviewAverage: reviewFromDb._id } },
        { new: true }
      );
    })
    .then((wineFromDb) => {
      // here we calculate the new average rating
      return Review.find({ wine: wineFromDb._id }).then((reviews) => {
        const totalRatings = reviews.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        const averageRating = totalRatings / reviews.length;

        // then we update the ratingAverage field in the Wine model
        return Wine.findByIdAndUpdate(
          wineFromDb._id,
          { ratingAverage: averageRating },
          { new: true }
        );
      });
    })
    .then((updatedWine) => {
      res.json(updatedWine);
    })
    .catch((error) => {
      console.log("error while adding rating", error);
      res.status(500).json({ message: "Error while adding review" });
    });
});

module.exports = router;

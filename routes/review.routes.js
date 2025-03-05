const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")

const Review = require('../models/Review.model');
const Wine = require("../models/Wine.model");
const { response } = require("../app");


router.post('/reviews', (req, res, next) => {
    const {rating, wineId} = req.body;

    Review.create({
        rating,
        wine: wineId
    })
    .then( (reviewFromDb) => {
        return Wine.findByIdAndUpdate(wineId, {
            $push: { reviews: reviewFromDb._id }
        }, { new: true });
    })
    .then((response) => {
        res.json(response)
    })
    .catch((error) => {
        console.log('error while adding rating', error);
        res.status(500).json({message: 'Error while adding review'})
    })
})

module.exports = router;
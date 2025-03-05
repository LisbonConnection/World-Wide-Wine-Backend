const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")

const Wine = require("../models/Wine.model");


//create a wine
router.post("/wines", (req, res, next) => { 

    const { 
        wineName,
        varietalName,
        image,
        region,
        price,
        description,
        reviewAverage
    } = req.body;

    Wine.create({
        wineName,
        varietalName,
        image,
        region,
        price,
        description,
        reviewAverage
    })
    .then( (wineFromDB) => {
        res.status(201).json(wineFromDB);
    })
    .catch( (error) => {
        console.log('Error while creating the wine', error);
        res.status(500).json({message: 'Error while creating the wine'})
    })
})


module.exports = router;
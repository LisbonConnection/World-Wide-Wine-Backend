const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")

const Wine = require("../models/Wine.model");
const Review = require('../models/Review.model');


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

//Retrieve all wines
router.get("/wines", (req, res, next) => {
    Wine.find()
    .populate('reviewAverage')
    .then( (wineFromDB) => {
        res.json(wineFromDB)
    })
    .catch( (error) => {
        console.log('Error while getting the wines', error)
        res.status(500).json({message: 'Error while getting the wines'})
    })
})

//Retrieve a specific wine
router.get("/wines/:wineId", (req, res, next) => {
    const {wineId} = req.params
    Wine.findById(wineId)
    .populate('reviewAverage')
    .then( (wineFromDB) => {
        res.status(200).json(wineFromDB)
    })
    .catch((error) => {
        console.log('Error retrieving the wine', error)
        res.status(500).json({message: 'Error retrieving the wine'})
    })
})

//Update a specific wine
router.put('/wines/:wineId', (req, res, next) => {
    const {wineId} = req.params

    Wine.findByIdAndUpdate(wineId, req.body, {new:true})
    .then( (wineFromDB) => {
        res.status(200).json(wineFromDB)                                                                                     
    })
    .catch((error) => {
        console.log('Error while updating the wine', error)
        res.status(500).json({message: 'Error while updating the wine'})
    })
})


//Delete a specific wine 
router.delete('/wines/:wineId', (req, res, next) => {
    const {wineId} = req.params

    Wine.findByIdAndDelete(wineId)
    .then( () => {
        res.json({message: `wine with ${wineId} deleted succesfully`})
        console.log(wineId)
    })
    .catch((error) => {
        console.log('Error while deleting the wine', error)
        res.status(500).json({message: 'Error while deleting the wine'})
    })
})


module.exports = router;
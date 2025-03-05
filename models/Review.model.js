const {Schema,model} = require("mongoose");

const reviewSchema = new Schema({

    rating: {
        type: Number
        required: true
        min: 1,
        max: 5
    },

})

const Review = model("Review", reviewSchema)
module.exports = Review

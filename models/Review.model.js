const {Schema,model} = require("mongoose");

const reviewSchema = new Schema({

    rating: {
        type: Number
    },

})

const Review = model("Review", reviewSchema)
module.exports = Review

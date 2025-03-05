const {Schema,model} = require("mongoose");

const reviewSchema = new Schema({

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    wine: {
        type: Schema.Types.ObjectId,
        ref: "wine"
    }
})

const Review = model("Review", reviewSchema)
module.exports = Review

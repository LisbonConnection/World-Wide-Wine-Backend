const {Schema,model} = require("mongoose");

const wineSchema = new Schema({
    wineName: {
        type: String,
        required: true,
    },
    varietalName: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        default: "https://i.imgur.com/r8bo8u7.png"
    },
    
    region: {
        type: String,
        required: true,
    },
    price: {
        type: Number
    },

    description: {
        type: String,
        required: true
    },

    reviewAverage: {
        type: Schema.Types.ObjectId,
        ref: "Review"
    }
})

const Wine = model("Wine", wineSchema)
module.exports = Wine;
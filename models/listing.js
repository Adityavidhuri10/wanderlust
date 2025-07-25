const mongoose = require('mongoose');
const review = require('./review.js');
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
        filename: {
            type: String,
            default: 'default_image'
        },
        url: {
            type: String,
            default: "https://t4.ftcdn.net/jpg/02/56/10/07/360_F_256100731_qNLp6MQ3FjYtA3Freu9epjhsAj2cwU9c.jpg",
            set: (v) => v === "" ? "https://t4.ftcdn.net/jpg/02/56/10/07/360_F_256100731_qNLp6MQ3FjYtA3Freu9epjhsAj2cwU9c.jpg" : v
        }
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner : {
          type : mongoose.Schema.Types.ObjectId,
            ref : "User",
    },
});

listingSchema.post("findOneAndDelete",async (listing) => {
    if(listing){
    await review.deleteMany({_id:{$in : listing.reviews}});
    }
});
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;


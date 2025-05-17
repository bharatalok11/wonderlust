const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description: String,
    image: {
        type : String, // URL of the image
        default : "https://plus.unsplash.com/premium_photo-1678297269980-16f4be3a15a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set : (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1678297269980-16f4be3a15a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
    },
    price: Number,
    location: String,
    country : String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// mongoose middleware to delete reviews when a listing is deleted
listingSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews} });
    }
});

// const ModelName = mongoose.model('CollectionName', schemaName);
const Listing  = mongoose.model('Listing', listingSchema);
module.exports = Listing;
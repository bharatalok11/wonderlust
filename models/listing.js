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
        url : String,
        filename : String
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
    },
    geometry: {
        type: {
            type: String,   
            enum: ['Point'], // 'geometry.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
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
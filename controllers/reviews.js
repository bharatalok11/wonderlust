const Review = require("../models/review");
const Listing = require('../models/listing');

module.exports.createReview = async(req,res)=>{
    let {id} = req.params;
    // console.log(id);
    let newReview = new Review(req.body.review);
    // console.log(newReview);

    let listing = await Listing.findById(id);

    // adding the owner of the review to the review
    newReview.createdBy = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    
    // console.log(listing);
    // console.log("New Review: ");
    req.flash("success", "New review added successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    // console.log(id, reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    // console.log("Deleted Review: ", deletedReview);

    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
}
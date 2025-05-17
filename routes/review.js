const express = require('express');
const router = express.Router({mergeParams: true}); // mergeParams is used to access params from parent route   
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewOwner } = require('../middleware.js');
const reviewController = require('../controllers/reviews.js')

// reviews - post route - create a new review
router.post("/",isLoggedIn ,validateReview , wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",isLoggedIn ,isReviewOwner,wrapAsync(reviewController.destroyReview));

module.exports = router;
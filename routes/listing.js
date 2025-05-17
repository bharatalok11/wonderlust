const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwnner, validateListing} = require('../middleware.js')
const listingController = require('../controllers/listings.js');

// index route , create route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing , wrapAsync(listingController.createListing))
    
// new route is above show route, because if we keep it below show route, and will not work as expected 
router.get("/new", isLoggedIn , listingController.renderNewForm);

// show route, update route , delete route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwnner, validateListing , wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwnner, wrapAsync(listingController.destroyListing))

// edit route
router.get("/:id/edit",isLoggedIn, isOwnner ,wrapAsync(listingController.renderEditForm));

module.exports = router;
const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwnner, validateListing} = require('../middleware.js')
const listingController = require('../controllers/listings.js');

// index route
router.get("/", wrapAsync(listingController.index));

// new route is above show route, because if we keep it below show route, and will not work as expected 
router.get("/new", isLoggedIn , listingController.renderNewForm);

// show route
router.get("/:id", wrapAsync(listingController.showListing));

// create route
router.post("/", isLoggedIn, validateListing , wrapAsync(listingController.createListing));

// edit route
router.get("/:id/edit",isLoggedIn, isOwnner ,wrapAsync(listingController.renderEditForm));

// update route
router.put("/:id",isLoggedIn,isOwnner, validateListing , wrapAsync(listingController.updateListing));

// delete route
router.delete("/:id",isLoggedIn, isOwnner, wrapAsync(listingController.destroyListing));

module.exports = router;
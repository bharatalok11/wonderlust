const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwnner, validateListing} = require('../middleware.js')
const listingController = require('../controllers/listings.js');
const multer = require('multer');

const {storage} = require('../cloudConfig.js')
const upload = multer({storage});

// index route , create route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, 
        upload.single('listing[image]'),
        validateListing , 
        wrapAsync(listingController.createListing)
    );

// new route is above show route, because if we keep it below show route, and will not work as expected 
router.get("/new", isLoggedIn , listingController.renderNewForm);

// show route, update route , delete route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwnner, upload.single('listing[image]'),validateListing , wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwnner, wrapAsync(listingController.destroyListing))

// edit route
router.get("/:id/edit",isLoggedIn, isOwnner ,wrapAsync(listingController.renderEditForm));

module.exports = router;
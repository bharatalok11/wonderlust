const express = require('express');
const router = express.Router({mergeParams : true});

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listing');
const {isLoggedIn, isOwnner, validateListing} = require('../middleware.js')



// index route
router.get("/", wrapAsync(async(req,res)=>{
    let allListings = await Listing.find();
    res.render("./listings/index.ejs",{allListings});
}));

// new route
// new route is above show route, because if we keep it below show route, and will not work as expected 
router.get("/new", isLoggedIn , (req,res)=>{
    res.render("./listings/new.ejs");
});

// show route
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
                    .populate({
                        path: 'reviews',
                        populate: { path: 'createdBy'}
                    })
                    .populate('owner');

    // console.log(listing);
    if (!listing) {
        // throw new ExpressError(404, "Listing not found");
        req.flash("error", "Listing you are looking for does not exists!");
        res.redirect("/listings");
    }else{
        res.render("./listings/show.ejs", {listing});
    }
}));

// create route
router.post("/", isLoggedIn, validateListing , wrapAsync(async (req,res,next)=> {
    let newListing = new Listing(req.body.listing);
    // console.log(newListing);
    newListing.owner = req.user._id; // this is the id of the user who created the listing
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect('/listings');
}));

// edit route
router.get("/:id/edit",isLoggedIn, isOwnner ,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        // throw new ExpressError(404, "Listing not found");
        req.flash("error", "Listing you are looking for does not exists!");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing});
}));

// update route
router.put("/:id",isLoggedIn,isOwnner, validateListing , wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body
        .listing, {runValidators:true, new:true});
    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));


// delete route
router.delete("/:id",isLoggedIn, isOwnner, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // now, we will delete all the reviews associated with this listing
    // post middleware written in listing.js will take care of this
    // console.log("Deleted Listing: ", deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;
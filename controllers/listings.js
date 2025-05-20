const Listing = require("../models/listing.js");
const { cloudinary } = require('../cloudConfig.js');

const mapToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res)=>{
    let allListings = await Listing.find();
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.showListing  = async(req,res)=>{
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
}

module.exports.createListing = async (req,res,next)=> {

    let newListing = new Listing(req.body.listing);
    let geoData = await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location},${req.body.listing.country}`,
        limit: 1
        }).send();
    
    newListing.owner = req.user._id; // this is the id of the user who created the listing
    newListing.image = {
        url : req.file.path,
        filename : req.file.filename // public id of the image
    }
    // storing the coordinates in the listing
    newListing.geometry = geoData.body.features[0].geometry;

    let savedListing =  await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect('/listings');
}

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        // throw new ExpressError(404, "Listing not found");
        req.flash("error", "Listing you are looking for does not exists!");
        res.redirect("/listings");
    }

    // applying preview to the image
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace('/upload', '/upload/e_blur:400,bo_2px_solid_red');

    res.render("./listings/edit.ejs",{listing, originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    const originalListing = await Listing.findById(id);
    const toBeUpdatedListing = req.body.listing;

    // if location:changed => we need new coordinates
    if(toBeUpdatedListing.location !== originalListing.location ||
        toBeUpdatedListing.country !== originalListing.country){
        let geoData = await geocodingClient.forwardGeocode({
            query: `${toBeUpdatedListing.location},${toBeUpdatedListing.country}`,
            limit: 1
        }).send();
        toBeUpdatedListing.geometry = geoData.body.features[0].geometry;
    }
    
    
    if(req.file){
        toBeUpdatedListing.image = {
            url : req.file.path,
            filename : req.file.filename // public id of the image
        }

        // if the user has uploaded a new image, we need to delete the old image from cloudinary
        // we will get the old image filename from the database
        await cloudinary.uploader.destroy(originalListing.image.filename,{
            resource_type: "image",
            type: "upload",
            invalidate: true // this will invalidate the cache
        });
    }
    const listing = await Listing.findByIdAndUpdate(id, toBeUpdatedListing,
        {runValidators:true, new:true});
    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);

    // this will delete the image from cloudinary
    await cloudinary.uploader.destroy(deletedListing.image.filename,{
        resource_type: "image",
        type: "upload",
        invalidate: true // this will invalidate the cache
    });

    // now, we will delete all the reviews associated with this listing
    // post middleware written in listing.js will take care of this
    // console.log("Deleted Listing: ", deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}
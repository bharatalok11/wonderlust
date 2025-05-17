const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('./schema.js');

// Checks if user is logged in before accessing protected route like new, edit,update,delete in listing.js
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        if (req.method === 'GET') {
            req.session.postLoginUrl = req.originalUrl;
        }
        req.flash('error','you must be logged in first!');
        return res.redirect('/login');
    } else{
        next();
    }
}

// Prevents logged-in users from accessing /login , /signup routes
module.exports.isAlreadyLoggedIn = (req,res,next)=>{
    if (req.isAuthenticated()) {
        req.flash('error', 'You are already logged in!');
        return res.redirect('/'); 
    }
    next();
}

// Prevents already-logged-out users from accessing logout
module.exports.isAlreadyLoggedOut = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You are already logged out!");
        return res.redirect('/');
    }
    next();
};

module.exports.savePostLoginUrl = (req,res,next)=>{
    // console.log(req);
    if(req.session.postLoginUrl){
        res.locals.postLoginUrl = req.session.postLoginUrl;
    }
    next();
}

// validation for listing(middleware)
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// validation for review(middleware)
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isOwnner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission - As You are not owner!");
        return res.redirect(`/listings/${id}`); 
    }
    next();
};

module.exports.isReviewOwner = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.createdBy.equals(res.locals.currUser._id)){
        req.flash("error", "You are not owner of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
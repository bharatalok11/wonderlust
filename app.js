if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");

const session = require('express-session');
const MongoStore = require('connect-mongo'); // this is used to store session in mongo db
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user.js');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json()); // Parses JSON data in the request body
app.use(express.urlencoded({ extended: true })); // Parses form data (not needed for JSON)
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

// connecting to mongo db
const MONGODB_URL = process.env.ATLASDB_URL;
const PORT = process.env.PORT || 10000;
connectToDB().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log("Error connecting to DB", err); 
});
async function connectToDB() {
    await mongoose.connect(MONGODB_URL);
}

// session store 
const store = MongoStore.create({
    mongoUrl: MONGODB_URL,
    crypto: {
        secret: process.env.SESSION_SECRET, // secret to encrypt the session
    },
    touchAfter: 24 * 3600,                  // time period in seconds
    ttl: 24 * 3600 * 7,                     // time to live in seconds
});
store.on("error", (err)=>{
    console.log("Session store error", err);
});

// session configuration
const sessionConfig = {
    store : store,
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge : 1000 * 60 * 60 * 24 * 7,               // 7 days
        httpOnly : true,
        secure: process.env.NODE_ENV === "production",  // ensures cookie is sent over HTTPS
        sameSite: 'lax'                                 // CSRF protection
    }
};


// these two lines are used to set up session and flash messages in express should come before routes to work properly
app.use(session(sessionConfig));
app.use(flash());

// passport middlewares
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// our main middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // this is used in navbar.ejs 

    next();
});


// root route
app.get("/", (req,res)=>{
    res.render("./listings/root.ejs");
});

// listing ,review and user routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 route-default
app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "Page not found"));
})

// custom error handler
app.use((err,req,res,next)=>{
    // res.send("Something went wrong");
    let {statusCode=500 ,message="Something Went Wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const {savePostLoginUrl, isAlreadyLoggedIn, isAlreadyLoggedOut } = require('../middleware.js');
const userController = require('../controllers/users.js');

router.route("/signup")
    .get(isAlreadyLoggedIn , userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(isAlreadyLoggedIn, userController.renderLoginForm)
    // passport.authenticate() middleware invokes req.login() automatically
    .post(savePostLoginUrl,
        passport.authenticate('local',{failureRedirect:'/login' ,failureFlash : true}) ,
        wrapAsync(userController.login));

router.get('/logout',isAlreadyLoggedOut,userController.logout);

module.exports = router;
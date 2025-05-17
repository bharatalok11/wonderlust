const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const {savePostLoginUrl, isAlreadyLoggedIn, isAlreadyLoggedOut } = require('../middleware.js');
const userController = require('../controllers/users.js');

router.get('/signup', isAlreadyLoggedIn , userController.renderSignupForm);

router.post('/signup', wrapAsync(userController.signup));

router.get('/login',isAlreadyLoggedIn, userController.renderLoginForm);

// passport.authenticate() middleware invokes req.login() automatically
router.post('/login', 
    savePostLoginUrl,
    passport.authenticate('local',{failureRedirect:'/login' ,failureFlash : true}) ,
    wrapAsync(userController.login));

router.get('/logout',isAlreadyLoggedOut,userController.logout);

module.exports = router;
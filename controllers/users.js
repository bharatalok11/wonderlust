const User = require('../models/user.js');

module.exports.renderSignupForm = (req,res)=>{
    res.render('./users/signup.ejs');
}

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({
            email : email,
            username : username
        });
        const registeredUser = await User.register(newUser,password);
        // console.log(`registered user : ${registeredUser}`);

        // automatic login after signup
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","user registered and logged in successfully - welcome to wonderlust");
            res.redirect('/listings');
        });
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect('/signup');
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render('./users/login.ejs');
}

module.exports.login = async(req,res)=>{

    const redirectUrl = res.locals.postLoginUrl || '/listings';
    delete req.session.postLoginUrl; // Cleanup
    req.flash('success', "Welcome to Wonderlust - Logged in");
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully");
        res.redirect('/listings');
    });
    
    // console.log(`req.session.passport : ${req.session.passport}`);
    // console.log(`req.session.passport.user : ${req.session.passport.user}`);
    // console.log(`req.user : ${req.user}`);
}
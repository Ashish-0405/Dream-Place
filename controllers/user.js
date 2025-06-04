const User = require("../Model/user.js"); 

module.exports.renderSignUpPage = (req, res) => {
   res.render("users/newUser.ejs")
}

module.exports.afterSignUp = async(req, res) => {
    try{
    let { username, email, password } = req.body;
    const newUser =  new User({ email, username })
    const registeredUser = await User.register(newUser, password)
    console.log(registeredUser)
    req.login(registeredUser, (err) =>{
        if(err){
            next(err)
        }
        req.flash(`added`, `Welcome to the Dream Place!, ${req.body.username}`)
        res.redirect("/listings")
    })
    }catch(e){
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginPage = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.afterLogin = async(req, res) => {
     req.flash("added","Welcome back to the Dream Place!")
     let redirectUrl = res.locals.redirectUrl || '/listings'
     res.redirect(redirectUrl)
}


module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) {
           return next(err)
        }
        req.flash("added", "Goodbye! ")
        res.redirect("/listings")
    })
}

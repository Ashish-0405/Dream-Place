const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require(".//utils/wrapAsync.js")
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js")

const userControllers = require("../init/controllers/user.js")

// Route for signup for New User Rgistrer : 
router.get("/signup",userControllers.renderSignUpPage) 


// after signup data save to dbs :
router.post("/signup", wrapAsync(userControllers.afterSignUp))

// Route for login :
router.get("/login", userControllers.renderLoginPage)


// Route for login after submit :
router.post("/login",saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userControllers.afterLogin)


//logout Route 
router.get("/logout", userControllers.logout)

module.exports = router;
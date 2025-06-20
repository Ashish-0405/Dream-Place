const Listing = require("./Model/listing.js")
const ExpressError = require("./routes/utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./joiSchema.js");
const Review = require("./Model/review.js");



// Router for direct Logged in on website:
module.exports.isLoggedIn = (req, res, next) => {
   //   console.log(req.path, "..", req.originalUrl)
   //   console.log(req.user)
       if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl 
      req.flash("error", "You must be login")
      return res.redirect("/login")
   }
   next()
} 

//Router for to get direct url after login
module.exports.saveRedirectUrl = (req, res, next) => {
   if(req.session.redirectUrl) {
     res.locals.redirectUrl = req.session.redirectUrl
   }
   next()
}

//Middleware for Authorization :
module.exports.isOwner = async(req, res, next) => {
    const { id } = req.params;
    let listingAccess = await Listing.findById(id);
   if(!listingAccess.owner.equals(res.locals.currUser._id)){
      req.flash("error", "You don't have permission");
      return res.redirect(`/listings/${id}`);
   }
   next()
}

//Error Funtion by Using MiddleWare : 
module.exports.validatePlace = (req, res, next) => {
   let {error} = listingSchema.validate(req.body);
   if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg)
   }else{
      next()
   }
}

//Error Funtion by using Middleware for Reviews:
module.exports.validateReview = (req, res, next) => {
   let {error} = reviewSchema.validate(req.body);
   if(error){
      let errMsg = error.details.map((el) => el.message).join(",")
      throw new ExpressError(404, errMsg)
   }else{
      next()
   }
}

//Middleware for ReviewAuthorization :
module.exports.isReviewAuthor = async(req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
   if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "You don't have permission");
      return res.redirect(`/listings/${id}`);
   }
   next()
}

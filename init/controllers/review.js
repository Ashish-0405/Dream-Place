const Listing = require("../../Model/listing.js")
const Review = require("../../Model/review.js")

module.exports.createReview = async(req, res) => {
   const { id } = req.params;
   const { review } = req.body;
    let revlisting = await Listing.findById(id)
    let newReview = new Review(review)
    newReview.author = req.user._id;
    console.log(newReview)
    revlisting.reviews.push(newReview)
    await revlisting.save();
    await newReview.save();
   //  console.log("Review Saved");
    req.flash("added", "Review Created!")
    res.redirect(`/listings/${id}`)
}


module.exports.destroyReview = async(req, res) => {
   let { id, reviewId } = req.params;
   await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId} });
   await Review.findByIdAndDelete(reviewId);
    req.flash("added", "Review Deleted!")
   res.redirect(`/listings/${id}`)
}
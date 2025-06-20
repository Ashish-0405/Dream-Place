const Listing = require("../Model/listing")
// const mbxGecoding = require("@mapbox/mapbox-sdk");
// const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", { allListings })
}

module.exports.renderNewPlace = (req, res) => {
   res.render("listings/newPlace.ejs")
}

module.exports.showPlace = async (req, res) => {
   const { id } = req.params;
   const showListing = await Listing.findById(id).populate({
      path: "reviews", populate: {
         path: "author",
      }
   }).populate("owner")
   if (!showListing) {
      req.flash("error", "No Listing Found");
      res.redirect("/listings")
   }
   // console.log(showListing)
   // console.log(showListing)
   res.render("listings/show.ejs", { showListing })
}


module.exports.createPlace = async (req, res, next) => {
      let response =  await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 2
   }).send()

   let url = req.file.path;
   let filename = req.file.filename;
   // console.log(url, "..", filename) 
   const newListings = new Listing(req.body.listing)
   newListings.owner = req.user._id;
   newListings.image = { url, filename }
   newListings.geometry = response.body.features[0].geometry;
   let savedListing = await newListings.save()
   // console.log(savedListing)
   req.flash("added", "New Place Added!")
   //  console.log(newListings);
   res.redirect("/listings")
}

module.exports.renderEditPlace = async (req, res) => {
   const { id } = req.params;
   const showListing = await Listing.findById(id)
   if (!showListing) {
      req.flash("error", "No Listing Found");
      res.redirect("/listings");
   }
   res.render("listings/edit.ejs", { showListing })
}

module.exports.updatePlace = async (req, res) => {
   const { id } = req.params;
   let editList = await Listing.findByIdAndUpdate(id, { ...req.body.listing })

   if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      editList.image = { url, filename }
      await editList.save()
   }

   req.flash("added", "Edit Successfully!")
   res.redirect(`/listings/${id}`)
}

module.exports.destroyPlace = async (req, res) => {
   const { id } = req.params;
   const deletePlace = await Listing.findByIdAndDelete(id)
   console.log(deletePlace);
   req.flash("added", "Place Deleted!")
   res.redirect("/listings")
}
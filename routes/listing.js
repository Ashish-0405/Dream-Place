const express = require("express");
const router = express.Router();
const wrapAsync = require(".//utils/wrapAsync.js")
const { isLoggedIn, isOwner, validatePlace } = require("../middleware.js")
const placeControllers = require("../init/controllers/listing.js")
const multer = require("multer");
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage });


// Index Route For All Places
router.get("/", wrapAsync(placeControllers.index))

//New Place Create Route : 
router.get("/new", isLoggedIn, placeControllers.renderNewPlace)

// SHow Route : 
router.get("/:id", wrapAsync( placeControllers.showPlace))



// Create and Update: 
router.post("/",isLoggedIn, upload.single('listing[image]'), validatePlace, wrapAsync(placeControllers.createPlace))
// Edit Route : 
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(placeControllers.renderEditPlace))

// Update Route NEw data on index route:
router.put("/:id",isLoggedIn, isOwner, upload.single('listing[image]'), validatePlace ,wrapAsync(placeControllers.updatePlace))

//Delete Route : 
router.delete("/:id",isLoggedIn,isOwner, wrapAsync( placeControllers.destroyPlace))

module.exports = router;
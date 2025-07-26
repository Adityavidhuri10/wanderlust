const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
    .route("/")
      //Index route to render the home page
    .get( wrapAsync(listingController.index))         
      //create route to handle the form submission and create a new listing
    .post(isLoggedIn,validateListing,upload.single("listing[image][url]"),wrapAsync(listingController.createListing));


//new route to render the new listing form
router.get('/new',isLoggedIn,listingController.render);


router 
    .route("/:id")    
       //show route to render the listing details page
    .get(wrapAsync(listingController.showListing))
        //update route to handle the form submission and update the listing
    .put(isLoggedIn,isOwner,upload.single("listing[image][url]"),validateListing,wrapAsync(listingController.updateListing))
        //delete route to delete a listing
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//edit route to render the edit form
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEdit));



module.exports = router;
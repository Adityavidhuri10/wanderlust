const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner,validateListing } = require("../middleware.js");



//Index route to render the home page
router.get('/', wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index', { allListings });
}));

//new route to render the new listing form
router.get('/new',isLoggedIn, (req, res) => { //makes confusion with id if written below listings/:id
  
  res.render('listings/new');
});
//create route to handle the form submission and create a new listing
router.post('/', validateListing,wrapAsync(async (req, res, next) => {
  // let { title, description,image, price, location, country } = req.body;  
  // const newListing = new Listing({
  //     title,
  //     description,
  //     image,
  //     price,
  //     location,
  //     country
  // });
  // await newListing.save();

  // res.redirect('/listings');



  // SCHEMA VALIDATION
  // if(!req.body || !req.body.listing){
  //   throw new ExpressError(400,"Send valid data for listing");
  // }

  //Joi Validation
  // let result  = listingSchema.validate(req.body);
  // console.log(result);
  // if(result.error){
  //   throw new ExpressError(400,result.error);
  // }


  const newListing = new Listing(req.body.listing);

  //SCHEMA VALIDATION
  // if(!newListing.title){
  //   throw new ExpressError(400,"Title is missing");
  // }
  //  if(!newListing.description){
  //   throw new ExpressError(400,"description is missing");
  // }
  //  if(!newListing.location){
  //   throw new ExpressError(400,"location is missing");
  // }

  //we will use "joi" to validate our schema


  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success","New Listing Created!"); // using flash
  res.redirect('/listings');
}));

//show route to render the listing details page
router.get('/:id', wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path : "reviews",
    populate:{
      path : "author",
    },
  })
  .populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render('listings/show', { listing });

}));




//edit route to render the edit form
router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
   wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
    req.flash("error","Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render('listings/edit', { listing });
}));
//update route to handle the form submission and update the listing
router.put(
  '/:id',
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

//delete route to delete a listing
router.delete(
  '/:id',
  isLoggedIn,
  isOwner,
   wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted!");
  res.redirect('/listings');
}));


module.exports = router;
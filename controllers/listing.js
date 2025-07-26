const Listing = require("../models/listing");


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index', { allListings });
};

module.exports.render =  (req, res) => { //makes confusion with id if written below listings/:id
  
  res.render('listings/new');
};
module.exports.showListing = async (req, res) => {
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
  res.render('listings/show', { listing });

};


module.exports.createListing = async (req, res, next) => {
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

  let url = req.file.path;
  let filename = req.file.filename;
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
  newListing.image = {url,filename};
  await newListing.save();
  req.flash("success","New Listing Created!"); // using flash
  res.redirect('/listings');
};


module.exports.renderEdit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
    req.flash("error","Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/h_150,w_250");
  res.render('listings/edit', { listing,originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file!=="undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename};
  await listing.save();
  }
   req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing  = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted!");
  res.redirect('/listings');
};
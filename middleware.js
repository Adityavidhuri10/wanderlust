const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require('./utils/ExpressError');
const { listingSchema,reviewSchema  } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
   console.log(req.user);
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;//post login page
      req.flash("error","You must be logged in to create listings!");
     return res.redirect("/login");
  }
  next();
};

//saving in url because passport delete the session to empty after authentication
module.exports.saveRedirectUrl = (req,res,next)=>{
    if( req.session.redirectUrl){
       res.locals.redirectUrl =  req.session.redirectUrl;
  }
  next();
};


//Authorization for listings
module.exports.isOwner = async(req,res,next)=>{
  let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id))
    {
      req.flash("error","You dont have permission to edit");
      return res.redirect(`/listings/${id}`);
    }
    next();
};

//Validation with middleware
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
     let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else {
    next();
  }
};

//validate reviews
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
     let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else {
    next();
  }
};

//validation reviews for delete
module.exports.isReviewAuthor = async(req, res, next) => {
  let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id))
    {
      req.flash("error","You are the author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
};

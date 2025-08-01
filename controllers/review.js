const Reviews = require('../models/review.js');
const Listing = require('../models/listing.js');



module.exports.createReview = async(req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReview = new Reviews(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  console.log("new review saved");
   req.flash("success","New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res)=>{
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
  await Reviews.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted!");
  res.redirect(`/listings/${id}`);
};
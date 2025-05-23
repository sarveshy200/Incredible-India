const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema , reviewSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //redirectURl
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create listings!");
    return res.redirect("/login");
  }
  next();
};


module.exports.saveRedirectUrl = (req, res, next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to edit this listing");
    return res.redirect(`/listings/${id}`);
  }
  next(); // ← Don't forget to call next() to continue the middleware chain
};


module.exports.validateListing = (req, res , next) =>{
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

module.exports.validateReview = (req, res, next) =>{
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewsId } = req.params;
  let review = await Review.findById(reviewsId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next(); // ← Don't forget to call next() to continue the middleware chain
};
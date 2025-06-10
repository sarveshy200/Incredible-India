const Category = require("../models/category");
const Listing = require("../models/listing");

// Show all listings
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

// Show new listing form
module.exports.renderNewForm = async (req, res) => {
  const categories = await Category.find({});
  if (req.user && req.user.username === "sarvesh200") {
    res.render("listings/new.ejs", { categories });
  } else {
    req.flash("error", "You are not authorized to create a listing.");
    return res.redirect("/listings");
  }
};


// Show a single listing
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// Create new listing
module.exports.createListing = async (req, res) => {
  if (req.user.username !== "sarvesh200") {
    req.flash("error", "You are not authorized to create listings.");
    return res.redirect("/listings");
  }

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.categories = req.body.listing.categories;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};


// Show edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
 const listing = await Listing.findById(id).populate("categories"); 
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImgUrl = listing.image.url;
  originalImgUrl = originalImgUrl.replace("/upload", "/upload/h_300,w_250");
  const allCategories = await Category.find({});
  res.render("listings/edit.ejs", {
    listing,
    originalImgUrl,
    allCategories
  });
};

// Update listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  if (req.body.listing.categories) {
    listing.categories = req.body.listing.categories;
  } else {
    listing.categories = []; 
  }
  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};


// Delete listing
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};



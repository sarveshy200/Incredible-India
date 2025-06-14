const Category = require("../models/category");
const Listing = require("../models/listing");
const BookNow = require("../models/bookNow");

// Show all listings
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  const categories = await Category.find({});
  res.render("listings/index.ejs", {
    allListing,
    categories,
    activeCategory: null   // ✅ Add this line
  });
};


module.exports.searchListing = async (req, res) => {
  const { title } = req.query;
  const categories = await Category.find({});
  let allListing;

  if (title) {
    allListing = await Listing.find({
      title: { $regex: title, $options: "i" }
    });
  } else {
    allListing = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListing, categories });
};

module.exports.listByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const allListing = await Listing.find({ categories: categoryId });
  const categories = await Category.find({});
  res.render("listings/index.ejs", {
    allListing,
    categories,
    activeCategory: categoryId 
  });
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

module.exports.createBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    const {
      name,
      email,
      phone,
      address,
      members,
      date,
      memberNames
    } = req.body.booking;
    const formattedNames = typeof memberNames === "string"
      ? memberNames.split(",").map(name => name.trim())
      : Array.isArray(memberNames)
        ? memberNames.map(name => name.trim())
        : [];

    const newBooking = new BookNow({
      listing: listing._id,
      name,
      email,
      phone,
      address,
      members,
      memberNames: formattedNames,
      date
    });

    await newBooking.save();
    req.flash("success", "Booking created successfully!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Booking creation error:", err);
    req.flash("error", "There was a problem creating your booking.");
    res.redirect("/listings");
  }
};





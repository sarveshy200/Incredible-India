const express = require("express"); 
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing , validateBooking} = require("../middleware");
const listingController = require("../controllers/listings");
const multer  = require('multer')
const {storage} = require("../cloudConfig"); 
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing, 
  wrapAsync(listingController.createListing)
);

router.get("/search", wrapAsync(listingController.searchListing));

router.get("/category/:categoryId", wrapAsync(listingController.listByCategory));

router.post("/:id/bookings", isLoggedIn,validateBooking, wrapAsync(listingController.createBooking));

// New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
)


// Edit Form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);



module.exports = router;

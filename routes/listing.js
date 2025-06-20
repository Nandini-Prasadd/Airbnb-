const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listings");

//Index Route
router.get("/", wrapAsync(listingController.index));

//New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Listing
router.get("/:id", wrapAsync(listingController.showListing));

// Create New Listing
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);
//   try {
//     //let {title, description, image, price, location, country}  = req.body;
//     const listing = req.body.listing;
//     await new Listing(listing).save();
//     res.redirect("/listings");
//   } catch (err) {
//     next(err);
//   }
// });

// Edit Listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// Update Listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete Listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;

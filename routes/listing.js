const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  })
);

router.get("/new", (req, res) => {
  res.render("./listings/new.ejs");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
  })
);

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if (!req.body.listing) {
    //   throw new ExpressError("Invalid Listing Data", 400);
    // }
    const listing = req.body.listing;
    // if (!listing.title || !listing.description) {
    //   throw new ExpressError("Title and Description are required", 400);
    // }

    await new Listing(listing).save();
    res.redirect("/listings");
  })
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

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;

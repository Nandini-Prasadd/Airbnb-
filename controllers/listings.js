const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  // console.log(req.user);
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  } else {
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
  }
};

module.exports.createListing = async (req, res, next) => {
  // let result = listingSchema.validate(req.body);
  // console.log(result);
  // if (!req.body.listing) {
  //   throw new ExpressError("Invalid Listing Data", 400);
  // }
  const listing = req.body.listing;
  // if (!listing.title || !listing.description) {
  //   throw new ExpressError("Title and Description are required", 400);
  // }
  listing.owner = req.user._id; // Set the owner to the logged-in user
  await new Listing(listing).save();
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  } else res.render("./listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
  req.flash("success", "Successfully updated the listing!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a new listing!");
  res.redirect("/listings");
};

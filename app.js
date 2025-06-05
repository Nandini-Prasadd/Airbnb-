const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

const listings = require("./routes/listing");
const reviews = require("./routes/review");

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// app.get("/testListing", (req, res) => {
//     let sampleListing = new Listing({
//         title: "my new villa",
//         description: "by the beach",
//         price: 1200,
//         location: "Meerut",
//         country: "India"

//     });
//     sampleListing.save()
//         .then((res) => {
//             console.log(res);

//         })
//         .catch((err) => {
//             console.log(err);
//         });
//     res.send("working");

// });

// app.all("*", (req, res, next) => {
//   next(new ExpressError("Page Not Found", 404));
// });

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.render("error.ejs", { err });
  //res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

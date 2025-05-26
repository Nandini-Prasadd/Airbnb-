const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


main()
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB", err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req,res)=>{
    res.send("Hello World");
});


app.get("/listings", async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
});

app.get("/listings/new", (req,res)=>{
    res.render("./listings/new.ejs");
});

app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing});
});

app.post("/listings", (req,res)=>{
    //let {title, description, image, price, location, country}  = req.body;
    let listing = req.body.listing;
    new Listing(listing).save()
    .then((listing)=>{
        console.log("Listing created", listing);
        res.redirect("/listings");
    })
    .catch((err)=>{
        console.log("Error creating listing", err);
        res.redirect("/listings/new");
    });

});

app.get("/listings/:id/edit", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
});

app.put("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new:true});
    res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

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

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});
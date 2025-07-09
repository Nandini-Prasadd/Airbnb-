const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6866c5d055b81a68a9e0120b",
  }));
  await Listing.insertMany(initData.data);
  console.log("Database initialized with sample data");
};

initDB();

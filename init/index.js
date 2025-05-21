const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// connecting to mongo db
const MONGODB_URL = process.env.ATLASDB_URL;
connectToDB().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log("Error connecting to DB", err); 
});
async function connectToDB() {
    await mongoose.connect(MONGODB_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  // console.log(initData.data);
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
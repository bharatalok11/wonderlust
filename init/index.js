const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// connecting to mongo db
const MONGODB_URL = "mongodb://127.0.0.1:27017/wonderlust";
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

  initData.data = initData.data.map((item)=>{
    return{
        ...item,
        owner : '682702a905c7ffc2004aa526'
    }
  });
  // console.log(initData.data);
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
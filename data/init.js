const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/song.js");

// Function to connect to MongoDB
async function main() {
  try {
    const MONGO_URL = "mongodb://127.0.0.1:27017/wavetune";
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

// Function to initialize the database
const initDB = async () => {
  try {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Data saved in DB");
  } catch (err) {
    console.error("Error saving data:", err);
  } finally {
    mongoose.connection.close(); // Close the database connection after operation
  }
};

// Call main and initialize DB
main()
  .then(() => initDB())
  .catch((err) => console.error(err));

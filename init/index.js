const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("../init/data");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to DB");
    initDB();
}).catch((err) => {
    console.error("Connection error:", err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        const modifiedData = initData.map((obj) => ({
            ...obj,
            owner: "6828c57b3203d014f4c836bb"
        }));
        await Listing.insertMany(modifiedData);
        console.log("Data was initialized");
    } catch (err) {
        console.error("Initialization error:", err);
    } finally {
        mongoose.connection.close();
    }
};

const mongoose = require("mongoose");
const Category = require("../models/category");

// Your MongoDB connection string
const dbUrl = "mongodb://127.0.0.1:27017/wanderlust"; // replace with your DB name

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

const seedCategories = async () => {
  const categories = [
    "Trending",
    "Entire Place",
    "Private Room",
    "Lakefront",
    "Mountain View",
    "Cabin",
    "Pool",
    "Wi-Fi"
  ];

  await Category.deleteMany({}); // Clears existing data (optional)
  await Category.insertMany(categories.map(name => ({ name })));
  console.log("Category data seeded!");
  mongoose.connection.close();
};

seedCategories();

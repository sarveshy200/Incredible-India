const mongoose = require("mongoose");
const BookNow = require("../models/bookNow");

// MongoDB connection string
const dbUrl = "mongodb+srv://sarveshy200:FcvLis2m5lBY2rbx@cluster0.85vjoec.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ MongoDB connected");
    seedBookings();
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });

// Dummy booking seeding function
const seedBookings = async () => {
  try {
    await BookNow.deleteMany({}); // Clear existing data (optional)

    const dummyBookings = [
      {
        listing: "684d752e3c0c09e3aab61288", // replace with actual Listing ID
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "9876543210",
        address: "123 Green Avenue, Delhi",
        members: 3,
        memberNames: ["Rahul", "Priya", "Kabir"],
        date: new Date(new Date().setDate(new Date().getDate() + 5))
      },
      {
        listing: "684d8793ef1ea05b057c0805", // replace with actual Listing ID
        name: "Anjali Mehta",
        email: "anjali@example.com",
        phone: "9123456789",
        address: "456 Rose Street, Mumbai",
        members: 2,
        memberNames: ["Anjali", "Rohit"],
        date: new Date(new Date().setDate(new Date().getDate() + 10))
      }
    ];

    await BookNow.insertMany(dummyBookings);
    console.log("✅ Bookings seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding bookings:", err);
    mongoose.connection.close();
  }
};

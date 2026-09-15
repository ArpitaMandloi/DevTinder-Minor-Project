require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const dummyUsers = require("../data/dummyUsers.json");

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI not found in .env");
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("✅ Database connected successfully.");

    console.log(`Seeding ${dummyUsers.length} dummy developer profiles...`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const userData of dummyUsers) {
      const existing = await User.findOne({ emailId: userData.emailId });
      const passwordHash = await bcrypt.hash(userData.password, 10);

      const userPayload = {
        firstName: userData.firstName,
        lastName: userData.lastName || "",
        emailId: userData.emailId.toLowerCase(),
        password: passwordHash,
        age: userData.age,
        gender: userData.gender,
        headline: userData.headline || "Full Stack Developer",
        location: userData.location || "Remote",
        yearsOfExperience: userData.yearsOfExperience || 0,
        githubUsername: userData.githubUsername || "",
        githubUrl: userData.githubUrl || "",
        linkedinUrl: userData.linkedinUrl || "",
        portfolioUrl: userData.portfolioUrl || "",
        skills: userData.skills || [],
        about: userData.about || "Passionate developer exploring cutting-edge tools!",
        photoUrl: userData.photoUrl,
      };

      if (existing) {
        await User.findByIdAndUpdate(existing._id, userPayload);
        updatedCount++;
      } else {
        await User.create(userPayload);
        createdCount++;
      }
    }

    console.log(
      `🎉 Seeding complete! Created: ${createdCount}, Updated: ${updatedCount}. Total dummy developers: ${dummyUsers.length}`
    );
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedDatabase();

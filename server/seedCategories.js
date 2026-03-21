// server/seedCategories.js
const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config(); // Make sure you have dotenv required to read your MONGO_URI

const categoriesToSeed = [
    // Age Groups
    { name: "Infants (0-1)", type: "Age Group" },
    { name: "Toddlers (1-3)", type: "Age Group" },
    { name: "Preschoolers (3-5)", type: "Age Group" },
    { name: "School Age (6-12)", type: "Age Group" },
    { name: "Teens (13+)", type: "Age Group" },

    // Topics
    { name: "Behavior & Discipline", type: "Topic" },
    { name: "Sleep & Routines", type: "Topic" },
    { name: "Nutrition & Feeding", type: "Topic" },
    { name: "Tech & Screen Time", type: "Topic" },
    { name: "Milestones & Growth", type: "Topic" },
    { name: "Emotional Regulation", type: "Topic" },
    { name: "Healing Generational Cycles", type: "Topic" },
    { name: "Attachment & Bonding", type: "Topic" },
    { name: "Family Dynamics & Boundaries", type: "Topic" },
    { name: "Parental Burnout & Self-Care", type: "Topic" },
    { name: "Child Psychology", type: "Topic" },
    { name: "Brain Development", type: "Topic" },
    { name: "Neurodiversity", type: "Topic" },
    { name: "Sensory Processing", type: "Topic" }
];

const seedDB = async () => {
    try {
        // Connect to your database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Clear out any existing categories so we don't get duplicates
        await Category.deleteMany({});
        console.log('Cleared existing categories...');

        // Insert the new array
        await Category.insertMany(categoriesToSeed);
        console.log('Successfully seeded categories!');

        // Close the connection
        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding data:', err);
        mongoose.connection.close();
    }
};

seedDB();
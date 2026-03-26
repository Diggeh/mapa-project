// server/seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const admins = [
    {
        email: "admin@mapa.com",
        password: "adminpassword123",
        role: "admin"
    },
    {
        email: "mapa_admin@example.com",
        password: "mapa_admin_2024",
        role: "admin"
    }
];

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        for (const adminData of admins) {
            // Check if admin already exists
            const existingAdmin = await User.findOne({ email: adminData.email });

            if (!existingAdmin) {
                // Hash the password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(adminData.password, salt);

                // Create the new admin
                const newAdmin = new User({
                    email: adminData.email,
                    password: hashedPassword,
                    role: adminData.role
                });

                await newAdmin.save();
                console.log(`Successfully created admin: ${adminData.email}`);
            } else {
                console.log(`Admin ${adminData.email} already exists. Skipping...`);
            }
        }

        console.log('Admin seeding process completed.');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding admin accounts:', err);
        mongoose.connection.close();
    }
};

seedAdmin();

// server/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Prevents duplicate categories
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Age Group', 'Topic'], // Forces it to be one of these two
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
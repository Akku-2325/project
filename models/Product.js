const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,  // Упрощенно, без отдельной модели Category
        required: true,
        enum: ['rings', 'necklaces', 'earrings', 'bracelets'], // Predefined categories
    },
    images: [{
        type: String, // Array of image URLs
    }],
    stockQuantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Product', productSchema);
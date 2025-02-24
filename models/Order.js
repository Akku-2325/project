const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    shippingAddress: { // Add shipping address
        type: {
            street: String,
            city: String,
        },
        required: false, // Или true, в зависимости от требований
    },
    paymentMethod: { // Add payment method
        type: String,
        required: false, // Или true, в зависимости от требований
    },
}, { versionKey: false });

module.exports = mongoose.model('Order', orderSchema);
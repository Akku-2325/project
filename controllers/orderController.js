const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
        const userId = req.user.id; // Assuming you have user info in req.user from auth middleware

        const order = new Order({
            user: userId,
            items,
            totalAmount,
        });

        await order.save();

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
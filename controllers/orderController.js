const Order = require('../models/Order');

// Get user's cart (pending order)
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Order.findOne({ user: userId, status: 'pending' }).populate('items.product'); // Populate product details
        if (!cart) {
            return res.status(200).json({ items: [], totalAmount: 0 }); // Return empty cart if not found
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add item to cart
exports.addItemToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity, price } = req.body; // Expect price from frontend too

        // Find the user's cart (pending order)
        let cart = await Order.findOne({ user: userId, status: 'pending' });

        // If cart doesn't exist, create one
        if (!cart) {
            cart = new Order({
                user: userId,
                items: [],
                totalAmount: 0,
            });
        }

        // Check if the item already exists in the cart
        const existingItemIndex = cart.items.findIndex(item => item.product == productId); // Use == for comparison
        if (existingItemIndex > -1) {
            // Update the quantity of the existing item
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add the new item to the cart
            cart.items.push({
                product: productId,
                quantity: quantity,
            });
        }

        // Update the total amount
        cart.totalAmount = cart.items.reduce((total, item) => total + item.quantity * price, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update item quantity in cart
exports.updateCartItemQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity, price } = req.body;

        const cart = await Order.findOne({ user: userId, status: 'pending' });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const existingItemIndex = cart.items.findIndex(item => item.product == productId);

        if (existingItemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items[existingItemIndex].quantity = quantity;
        cart.totalAmount = cart.items.reduce((total, item) => total + item.quantity * price, 0);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const cart = await Order.findOne({ user: userId, status: 'pending' });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product != productId);
        cart.totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.product.price, 0);
        await cart.save();

        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Clear cart (cancel order)
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Order.findOne({ user: userId, status: 'pending' });

        if (cart) {
            cart.status = 'cancelled'; // Or remove it completely with cart.remove()
            await cart.save();
        }

        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Checkout (convert cart to order)
exports.checkout = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Order.findOne({ user: userId, status: 'pending' });

        if (!cart) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        cart.status = 'processing'; // Or any other relevant status
        await cart.save();

        res.status(200).json({ message: 'Checkout successful', order: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
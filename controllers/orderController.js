const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart'); // Import Cart model
const mongoose = require('mongoose');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        // Find the cart in the 'carts' collection
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            return res.status(200).json({ items: [], totalAmount: 0 });
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
        const { productId, quantity, price } = req.body;

        // Find the user's cart
        let cart = await Cart.findOne({ user: userId });

        // If cart doesn't exist, create one
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
                totalAmount: 0,
            });
        }

        const existingItemIndex = cart.items.findIndex(item => item.product == productId);
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

        // Update the total amount correctly
        cart.totalAmount = (cart.totalAmount || 0) + (quantity * price);

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

        // Find the cart in the 'carts' collection
        const cart = await Cart.findOne({ user: userId });
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
  
      // Find the cart in the 'carts' collection
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const itemIndex = cart.items.findIndex(item => item.product == productId);
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      cart.items.splice(itemIndex, 1);
  
      cart.totalAmount = cart.items.reduce((total, item) => {
        if (item.product && item.product.price) {
          return total + item.quantity * Number(item.product.price);
        } else {
          console.warn('Product or price is undefined for item:', item);
          return total;
        }
      }, 0);
  
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
        // Find the cart in the 'carts' collection
        const cart = await Cart.findOne({ user: userId });

        if (cart) {
            await cart.remove();
        }

        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Checkout (convert cart to order)
exports.checkout = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user.id;
        const { shippingAddress, paymentMethod } = req.body;
        console.log("req.body:", req.body);

        // // Validate shipping address and payment method
        // if (!shippingAddress || !shippingAddress.street || (shippingAddress.street && shippingAddress.street.length < 3) || !shippingAddress.city || (shippingAddress.city && shippingAddress.city.length < 3)) {
        //     await session.abortTransaction();
        //     return res.status(400).json({ message: 'Shipping street and city are required' });
        // }

        // if (!paymentMethod) {
        //     await session.abortTransaction();
        //     return res.status(400).json({ message: 'Payment method is required' });
        // }

        // // Find the cart in the 'carts' collection
        // const cart = await Cart.findOne({ user: userId }).populate('items.product').session(session);

        // if (!cart) {
        //     await session.abortTransaction();
        //     return res.status(400).json({ message: 'Cart is empty' });
        // }

        // Create new order in the 'orders' collection
        const order = new Order({
            user: userId,
            items: cart.items,
            totalAmount: cart.totalAmount,
            status: 'processing',
            shippingAddress: {
              street: shippingAddress.street,
              city: shippingAddress.city
            },
            paymentMethod: paymentMethod,
        });

        await order.save({ session });

        // Update stock quantity
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id).session(session);
            if (!product) {
                await session.abortTransaction();
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            if (product.stockQuantity < item.quantity) {
                await session.abortTransaction();
                return res.status(400).json({ message: `Not enough stock for product: ${product.name}` });
            }

            product.stockQuantity -= item.quantity;
            await product.save({ session });
        }

        if (cart) {
            // Remove the cart from the 'carts' collection
            await Cart.deleteOne({ user: userId }).session(session);
      }

        await session.commitTransaction();

        res.status(200).json({ message: 'Checkout successful', order: order });
    } catch (error) {
        await session.abortTransaction();
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        session.endSession();
    }
};
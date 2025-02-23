const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

// Cart routes (require authentication)
router.get('/cart', authMiddleware.authenticate, orderController.getCart);
router.post('/cart/items', authMiddleware.authenticate, orderController.addItemToCart);
router.put('/cart/items/:productId', authMiddleware.authenticate, orderController.updateCartItemQuantity);
router.delete('/cart/items/:productId', authMiddleware.authenticate, orderController.removeItemFromCart);
router.delete('/cart', authMiddleware.authenticate, orderController.clearCart);

// Checkout route (require authentication)
router.post('/', authMiddleware.authenticate, orderController.checkout);

module.exports = router;
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth'); // Import auth middleware

// Admin routes (require authentication and admin role)
router.post('/', authMiddleware.authenticate, authMiddleware.authorize(['admin']), productController.createProduct);
router.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), productController.updateProduct);
router.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), productController.deleteProduct);

// Public routes (for all users)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
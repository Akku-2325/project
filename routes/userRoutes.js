const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); // Import auth middleware

router.get('/profile', authMiddleware.authenticate, userController.getProfile);
router.put('/profile', authMiddleware.authenticate, userController.updateProfile);

module.exports = router;
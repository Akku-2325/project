const Product = require('../models/Product');
const validator = require('validator');

// Admin only - Create a new product
exports.createProduct = async (req, res) => {
    try {
        // Validate input
        const { name, description, price, category, images, stockQuantity } = req.body;

        if (!name || !description || !price || !category || !images || !stockQuantity) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ message: 'Name must be a non-empty string' });
        }

        if (typeof description !== 'string' || description.trim().length === 0) {
            return res.status(400).json({ message: 'Description must be a non-empty string' });
        }

        if (!validator.isNumeric(String(price)) || price <= 0) {
            return res.status(400).json({ message: 'Price must be a positive number' });
        }

        if (!['rings', 'necklaces', 'earrings', 'bracelets'].includes(category)) {
            return res.status(400).json({ message: 'Category must be one of: rings, necklaces, earrings, bracelets' });
        }

        if (!Array.isArray(images) || images.length === 0 || !images.every(image => typeof image === 'string' && validator.isURL(image))) {
            return res.status(400).json({ message: 'Images must be an array of valid image URLs' });
        }

        if (!validator.isInt(String(stockQuantity), { min: 0 })) {
            return res.status(400).json({ message: 'Stock quantity must be a non-negative integer' });
        }

        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Admin only - Update a product
exports.updateProduct = async (req, res) => {
    try {
        // Validate input (only validate fields that are being updated)
        const { name, description, price, category, images, stockQuantity } = req.body;

        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim().length === 0) {
                return res.status(400).json({ message: 'Name must be a non-empty string' });
            }
        }

        if (description !== undefined) {
            if (typeof description !== 'string' || description.trim().length === 0) {
                return res.status(400).json({ message: 'Description must be a non-empty string' });
            }
        }

        if (price !== undefined) {
            if (!validator.isNumeric(String(price)) || price <= 0) {
                return res.status(400).json({ message: 'Price must be a positive number' });
            }
        }

        if (category !== undefined) {
            if (!['rings', 'necklaces', 'earrings', 'bracelets'].includes(category)) {
                return res.status(400).json({ message: 'Category must be one of: rings, necklaces, earrings, bracelets' });
            }
        }

        if (images !== undefined) {
            if (!Array.isArray(images) || images.length === 0 || !images.every(image => typeof image === 'string' && validator.isURL(image))) {
                return res.status(400).json({ message: 'Images must be an array of valid image URLs' });
            }
        }

        if (stockQuantity !== undefined) {
            if (!validator.isInt(String(stockQuantity), { min: 0 })) {
                return res.status(400).json({ message: 'Stock quantity must be a non-negative integer' });
            }
        }

        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// Admin only - Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all products (public)
// Get all products (public)
// productController.js
exports.getAllProducts = async (req, res) => {
    try {
        console.log("Query parameters:", req.query);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy;
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        const category = req.query.category;
        const searchQuery = req.query.search; // Получаем поисковый запрос

        const skip = (page - 1) * limit;

        let filter = {};
        if (category) {
            filter.category = category;
        }

        // Добавляем логику поиска по имени или описанию
        if (searchQuery) {
            filter.$or = [
                { name: { $regex: searchQuery, $options: 'i' } }, // Поиск по имени (регистронезависимый)
                { description: { $regex: searchQuery, $options: 'i' } } // Поиск по описанию (регистронезависимый)
            ];
        }

        let sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder;
        }

        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            products,
            page,
            limit,
            totalPages,
            totalProducts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// Get a specific product by ID (public)
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
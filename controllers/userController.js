const User = require('../models/User');
exports.getProfile = async (req, res) => {
    try {
        // req.user содержит информацию о пользователе, полученную из middleware аутентификации
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;

        // Validate input
        if (!username || !email) {
            return res.status(400).json({ message: 'Please provide username and email' });
        }

        // Update user profile
        const user = await User.findByIdAndUpdate(req.user.id, { username, email }, { new: true }).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
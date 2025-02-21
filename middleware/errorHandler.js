const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
  
    // Customize error responses based on the error type or status code
    if (err.name === 'ValidationError') {
      // Mongoose validation error
      return res.status(400).json({ message: err.message });
    }
  
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      // Invalid ObjectId (e.g., in a GET request)
      return res.status(400).json({ message: 'Invalid ID format' });
    }
  
    // Default error response
    res.status(500).json({ message: 'Something went wrong' });
  };
  
  module.exports = errorHandler;
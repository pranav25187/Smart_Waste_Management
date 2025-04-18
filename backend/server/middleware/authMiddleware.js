const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Ensure the Authorization header exists and is in the correct format
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { email: decodedToken.email, userId: decodedToken.id }; // Ensure the correct property name
    next();
  } catch (error) {
    console.error(error);
    
    // Check if the error is due to token expiration
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }

    // Handle other errors
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await userService.findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user info to request
    req.user = {
      userId: user.id,
      email: user.email,
      name: user.name,
      subscription: user.subscription
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to check if user has required subscription
const requireSubscription = (requiredSubscription) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userSubscription = req.user.subscription;
    const subscriptionTiers = ['starter', 'pro', 'enterprise'];
    
    const userTier = subscriptionTiers.indexOf(userSubscription);
    const requiredTier = subscriptionTiers.indexOf(requiredSubscription);
    
    if (userTier < requiredTier) {
      return res.status(403).json({ 
        message: `${requiredSubscription} subscription required`,
        currentSubscription: userSubscription,
        requiredSubscription: requiredSubscription
      });
    }

    next();
  };
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Add admin check logic here when you implement admin roles
  // For now, just check if user exists
  next();
};

module.exports = {
  authenticateToken,
  requireSubscription,
  requireAdmin
};

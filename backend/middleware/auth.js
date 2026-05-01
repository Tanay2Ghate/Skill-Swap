const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ success: false, code: 'TOKEN_EXPIRED', message: 'Token has expired' });
        }
        return res.status(401).json({ success: false, code: 'INVALID_TOKEN', message: 'Invalid token' });
      }
      
      req.user = decoded; // { id, email }
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;

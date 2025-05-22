const { query } = require('../config/database');

// Protect middleware - ensures user is authenticated
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader); // Log the full header
    
    const sessionId = authHeader?.split(' ')[1];
    console.log('Extracted Session ID:', sessionId); // Log the extracted ID

    if (!sessionId) {
      console.log('No session ID provided, returning 401');
      return res.status(401).json({ error: 'No session ID provided' });
    }
    
    // Get session and user info
    const result = await query(`
      SELECT u.*
      FROM user_sessions us
      JOIN users u ON us.user_id = u.id
      WHERE us.id = $1 
      AND us.expires_at > CURRENT_TIMESTAMP
    `, [sessionId]);
    
    console.log('Database query result for session:', result.rows); // Log query result

    if (result.rows.length === 0) {
      console.log('Invalid or expired session, returning 401');
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
    
    req.user = result.rows[0];
    console.log('Authentication successful for user:', req.user.username);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error); // Log any middleware errors
    res.status(500).json({ error: 'Authentication failed' }); // Return 500 for unexpected errors
  }
};

// Restrict middleware - restricts access based on role
const restrict = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'You do not have permission to perform this action' 
      });
    }
    
    next();
  };
};

module.exports = {
  protect,
  restrict
}; 
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Admin middleware
const adminMiddleware = async (req, res, next) => {
  try {
    const sessionId = req.headers.authorization?.split(' ')[1];
    if (!sessionId) {
      return res.status(401).json({ error: 'No session ID provided' });
    }
    
    // Get session and user info
    const result = await query(`
      SELECT u.*
      FROM user_sessions us
      JOIN users u ON us.user_id = u.id
      WHERE us.id = $1 
      AND us.expires_at > CURRENT_TIMESTAMP
      AND u.role = 'admin'
    `, [sessionId]);
    
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ error: 'Invalid session' });
  }
};

// Get all users
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all game progress
router.get('/progress', adminMiddleware, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        gp.*,
        l.name as level_name,
        u.username as user_username
      FROM game_progress gp
      LEFT JOIN levels l ON gp.level_id = l.id
      LEFT JOIN users u ON gp.user_id = u.id::text
      ORDER BY gp.completed_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get active sessions
router.get('/sessions', adminMiddleware, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        us.*,
        u.username
      FROM user_sessions us
      JOIN users u ON us.user_id = u.id
      WHERE us.expires_at > CURRENT_TIMESTAMP
      ORDER BY us.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a user
router.delete('/users/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user role
router.patch('/users/:id/role', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    await query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role',
      [role, id]
    );
    
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear expired sessions
router.post('/sessions/clear-expired', adminMiddleware, async (req, res) => {
  try {
    await query('DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP');
    res.json({ message: 'Expired sessions cleared successfully' });
  } catch (error) {
    console.error('Error clearing expired sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = { router };
  
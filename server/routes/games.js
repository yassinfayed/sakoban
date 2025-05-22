const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { protect } = require('../middleware/auth');

// Apply protect middleware to all routes
router.use(protect);

// Get all levels
router.get('/levels', async (req, res) => {
  try {
    const result = await query('SELECT * FROM levels ORDER BY id');
    const levels = result.rows.map(row => ({
      ...row.data,
      id: row.id
    }));
    res.json(levels);
  } catch (error) {
    console.error('Error fetching levels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        gp.id,
        gp.user_id,
        gp.level_id,
        gp.moves,
        gp.is_complete,
        gp.completed_at,
        gp.is_anonymous,
        gp.username,
        l.name as level_name
      FROM game_progress gp
      JOIN levels l ON gp.level_id = l.id
      WHERE gp.is_complete = true
      ORDER BY gp.moves ASC, gp.completed_at ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save game progress
router.post('/progress', async (req, res) => {
  try {
    const { userId, levelId, moves, isComplete, username } = req.body;
    
    if (!userId || !levelId) {
      return res.status(400).json({ message: 'User ID and Level ID are required' });
    }
    
    // Check if there's existing progress for this user and level
    const existingProgress = await query(
      'SELECT * FROM game_progress WHERE user_id = $1 AND level_id = $2',
      [userId, levelId]
    );
    
    if (existingProgress.rows.length > 0) {
      // Only update if the new score is better (fewer moves)
      if (moves < existingProgress.rows[0].moves) {
        await query(
          `UPDATE game_progress 
           SET moves = $1, is_complete = $2, completed_at = CURRENT_TIMESTAMP, username = $3
           WHERE user_id = $4 AND level_id = $5
           RETURNING *`,
          [moves, isComplete, username, userId, levelId]
        );
      }
    } else {
      // Insert new progress
      await query(
        `INSERT INTO game_progress 
         (user_id, level_id, moves, is_complete, is_anonymous, username)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [userId, levelId, moves, isComplete, userId.toString().startsWith('anon_'), username]
      );
    }
    
    res.status(201).json({ message: 'Progress saved successfully' });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start a new game
router.post('/', async (req, res) => {
  try {
    const { name, data } = req.body;
    
    if (!name || !data) {
      return res.status(400).json({ error: 'Name and data are required' });
    }
    
    const result = await query(
      'INSERT INTO games (name, data) VALUES ($1, $2) RETURNING *',
      [name, data]
    );
    
    const newGame = {
      ...result.rows[0].data,
      id: result.rows[0].id
    };
    
    res.status(201).json(newGame);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;

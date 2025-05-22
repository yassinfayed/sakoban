const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { protect, restrict } = require('../middleware/auth');

// Apply protect middleware to all routes
router.use(protect);

// Get all levels
router.get('/', async (req, res) => {
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

// Get a specific level
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM levels WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Level not found' });
    }
    
    const level = {
      ...result.rows[0].data,
      id: result.rows[0].id
    };
    
    res.json(level);
  } catch (error) {
    console.error('Error fetching level:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new level (admin only)
router.post('/', restrict('admin'), async (req, res) => {
  try {
    const { name, data } = req.body;
    
    if (!name || !data) {
      return res.status(400).json({ error: 'Name and data are required' });
    }
    
    const result = await query(
      'INSERT INTO levels (name, data) VALUES ($1, $2) RETURNING id, name, data',
      [name, data]
    );
    
    const newLevel = {
      ...result.rows[0].data,
      id: result.rows[0].id,
      name: result.rows[0].name
    };
    
    res.status(201).json(newLevel);
  } catch (error) {
    console.error('Error creating level:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

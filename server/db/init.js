const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function initializeDatabase() {
  try {
    // Read and execute the SQL initialization script
    const sqlScript = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await pool.query(sqlScript);
    console.log('Database tables created successfully');

    // Import and insert initial levels
    const levels = require('../seeding/levels.js'); // Assuming levels are in levels.json
    for (const level of levels) {
      // Omit the id column in the INSERT statement
      await pool.query(
        'INSERT INTO levels (name, data) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING', // Conflict on name now
        [`Level ${level.level}`, JSON.stringify(level)]
      );
    }
    console.log('Initial levels inserted successfully');

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initializeDatabase(); 
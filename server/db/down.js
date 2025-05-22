const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function dropDatabase() {
  try {
    // Read and execute the SQL down script
    const sqlScript = fs.readFileSync(path.join(__dirname, 'down.sql'), 'utf8');
    await pool.query(sqlScript);
    console.log('Database tables dropped successfully');

  } catch (error) {
    console.error('Error dropping database tables:', error);
    // Don't exit with error code 1, as dropping might fail if tables don't exist, which is okay.
    // process.exit(1);
  } finally {
    await pool.end();
  }
}

dropDatabase(); 
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const levelRoutes = require('./routes/levels');
const gameRoutes = require('./routes/games');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin').router;

const app = express();
const PORT = process.env.PORT || 9990;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/levels', levelRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

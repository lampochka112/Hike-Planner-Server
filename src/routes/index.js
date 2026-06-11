const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const tripRoutes = require('./trips');

router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;

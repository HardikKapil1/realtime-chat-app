const express = require('express');
const healthRoutes = require('./healthRoutes');
const messageRoutes = require('./messageRoutes');

const router = express.Router();

// Mount individual route modules
router.use('/health', healthRoutes);
router.use('/messages', messageRoutes);

module.exports = router;

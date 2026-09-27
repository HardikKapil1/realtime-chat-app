const mongoose = require('mongoose');

/**
 * Health check controller.
 * Returns server status and basic diagnostics.
 */
const getHealthStatus = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    status: 'ok',
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbStates[dbState] || 'unknown',
    },
  });
};

module.exports = {
  getHealthStatus,
};

// App factory — export for testing without starting the server
const express = require('express');
const cors = require('cors');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/jobs', require('./routes/jobs'));
  app.use('/api/auth', require('./routes/auth'));

  // 404 for unknown routes
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  });

  return app;
}

module.exports = createApp;

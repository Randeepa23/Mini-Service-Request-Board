const mongoose = require('mongoose');
require('dotenv').config();
const createApp = require('./app');

const PORT = process.env.PORT || 5000;

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingEnvVars.length) {
  console.error(`Missing required env vars: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const app = createApp();

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10_000,
    });
    console.log('MongoDB connected');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

start();
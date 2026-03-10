require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// Start Server
const PORT = process.env.PORT || 5000;
// Cron Job: Ping health API every 14 minutes and 32 seconds (872,000 ms)
const PING_INTERVAL = 14 * 60 * 1000 + 32 * 1000;
setInterval(() => {
  // Use dynamic import for node-fetch or use pure internal http, but Node 18+ has native fetch
  fetch(`http://localhost:${PORT}/api/health`)
    .then(res => res.json())
    .then(data => console.log('Self-ping success:', data))
    .catch(err => console.error('Self-ping failed:', err.message));
}, PING_INTERVAL);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

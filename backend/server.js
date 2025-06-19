// server.js
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const mongoose = require('mongoose');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// 1) Body parser
app.use(express.json());

// 2) CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// 3) MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected!');
    // ← add this block:
    console.log('Using DB:', mongoose.connection.db.databaseName);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });


// 4) Routes
app.use('/api/events', eventRoutes);

// 5) Health check
app.get('/', (req, res) => res.send('API is running! 🚀'));

// 6) Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // <-- missing in your original code
const Event = require('./models/Event');
const eventRoutes = require('./routes/eventRoutes');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/events', eventRoutes);


app.get('/', (req, res) => {
  res.send('API is running! 🚀');
});

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log('MongoDB connected! 🟢'))
//   .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
  
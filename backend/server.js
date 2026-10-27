require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const allowed = (process.env.CLIENT_URL || '').split(',').map(s => s.trim()).filter(Boolean)
  .concat(['http://localhost:5173', 'http://localhost:8080']);

app.use(cors({
  origin: (origin, cb) => (!origin || allowed.includes(origin)) ? cb(null, true) : cb(new Error('Not allowed by CORS'))
}));
app.use(express.json());

app.get('/health', (req, res) => res.json({
  status: 'UP',
  db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}));
app.use('/api/employees', require('./routes/employees'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully'))
  .catch(err => console.error('MongoDB connection error:', err.message));

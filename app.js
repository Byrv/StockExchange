const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const orderRoutes = require('./routes/orderRoutes');
const app = express();
require('dotenv').config();


app.use(express.json()); // for parsing application/json

// API routes
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/orders', orderRoutes); // Add this line to include orderRoutes

// Basic home route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Stock Exchange App API!');
});

// Catch-all for non-existing routes
app.use((req, res, next) => {
    res.status(404).send("Sorry, can't find that!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Connect to MongoDB
const connectionURL = process.env.MONGODB_URI;
mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB...'))
.catch((err) => console.error('Could not connect to MongoDB...', err));

module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Product = require('./models/Product');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend files from current directory
app.use(express.static(path.join(__dirname)));

// Export Vercel serverless function
module.exports = app;

// Connect to MongoDB (Atlas in production, local for dev fallback)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crochetnook';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


// Import admin routes module
const adminRoutes = require('./routes/admin');

app.use('/api', adminRoutes);
app.use('/.netlify/functions/api', adminRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

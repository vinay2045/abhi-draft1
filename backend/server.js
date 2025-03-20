const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true // Allow cookies to be sent with requests
}));
app.use(cookieParser()); // Parse cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve static files from admin panel (CSS, JS, images)
app.use('/admin/css', express.static(path.join(__dirname, '../admin/css')));
app.use('/admin/js', express.static(path.join(__dirname, '../admin/js')));
app.use('/admin/images', express.static(path.join(__dirname, '../admin/images')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('*** Running in mock data mode (MongoDB not connected) ***');
  // Continue running the server even if MongoDB connection fails
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const formSubmissionRoutes = require('./routes/formSubmissionRoutes');
const contentRoutes = require('./routes/contentRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/forms', formSubmissionRoutes);
app.use('/api/content', contentRoutes);

// Serve frontend HTML for regular user routes
app.get(['/', '/index.html', '/aboutus.html', '/contactus.html'], (req, res) => {
  const requestedPath = req.path === '/' ? '/index.html' : req.path;
  res.sendFile(path.join(__dirname, '../frontend/templates', decodeURIComponent(requestedPath)));
});

// Handle spaces in URLs for service pages
app.get('/Flight%20Tickets.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/templates/Flight Tickets.html'));
});

app.get('/visa%20for%20all%20countries.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/templates/visa for all countries.html'));
});

app.get('/forex.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/templates/forex.html'));
});

app.get('/Apply%20For%20Passport%20Application.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/templates/Apply For Passport Application.html'));
});

app.get('/honeymoonpackages.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/templates/honeymoonpackages.html'));
});

app.get('/Domestic%20Tours.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/templates/Domestic Tours.html'));
});

app.get('/International%20Tours.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/templates/International Tours.html'));
});

// Serve admin panel HTML files
app.get(['/admin', '/admin/', '/admin/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/templates/index.html'));
});

app.get('/admin/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/templates/login.html'));
});

app.get('/admin/*.html', (req, res) => {
  const requestedPath = req.path.replace('/admin/', '');
  res.sendFile(path.join(__dirname, '../admin/templates', requestedPath));
});

// Add a test route to verify server is running
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'API is working!', 
    server: 'Express', 
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected',
    cookies: req.cookies
  });
});

// Catch-all route handler for non-existent routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 
// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.send('SmartLearn Backend is running!');
});

// Example route for contact form
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  // You can add nodemailer or DB storage here
  console.log(`Received contact: ${name}, ${email}, ${message}`);
  res.json({ status: 'success', message: 'Message received!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const uploadRoutes = require('./routes/uploadRoutes'); // Import routes
const fileRoutes = require('./routes/fileRoutes'); // Import routes

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', uploadRoutes);
app.use('/api', fileRoutes);
connectDB();
// // MongoDB Connection
// mongoose.connect(, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log('Failed to connect to MongoDB:', err));

// File Upload Setup (using multer)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Ensure uploads folder exists
//     cb(null, 'uploads/'); // Store files in the 'uploads' folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Save with unique filename
//   }
// });

// const upload = multer({ storage: storage });

// // Routes
// app.post('/api/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded');
//   }

//   // File uploaded successfully
//   res.status(200).json({
//     message: 'File uploaded successfully',
//     filePath: req.file.path, // Send back the file path for import
//   });
// });

// app.post('/api/import', (req, res) => {
//   const { filePath } = req.body;

//   if (!filePath) {
//     return res.status(400).send('File path is required');
//   }

//   // Perform your file import logic here
//   // For example, reading the file and saving data into MongoDB
//   // Simulating success for now
//   res.status(200).json({ message: 'File imported successfully' });
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

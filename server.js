const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Simple password
const PASSWORD = 'kunal321'; // change this

// Middleware to check password for API endpoints
app.use(['/upload','/files','/download/:filename'], (req, res, next) => {
  if (req.query.password !== PASSWORD) {
    return res.status(401).send('Unauthorized: wrong password');
  }
  next();
});

// Create uploads folder if not exist
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Serve the HTML UI
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded: ' + req.file.filename);
});

// List files
app.get('/files', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) return res.status(500).send('Error reading files');
    res.json(files);
  });
});

// Download endpoint
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.download(filePath);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

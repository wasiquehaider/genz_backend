const express = require('express');
const upload = require('../controllers/upload'); // Import Multer middleware
const router = express.Router();

// Upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({
    message: 'Upload successful',
    fileUrl,
  });
});

module.exports = router;

const multer = require('multer');
const path = require('path');

// Define the storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in 'uploads' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
    },
});

// Middleware to handle file uploads
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
});

// Export the middleware
module.exports = upload;

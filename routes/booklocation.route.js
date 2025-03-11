const express = require('express');
const { bookLocation, getBookingsLocation } = require('../controllers/bookinglocation.controller');
const router = express.Router();

// Booking route
router.post('/', bookLocation);
router.get('/', getBookingsLocation);

module.exports = router;

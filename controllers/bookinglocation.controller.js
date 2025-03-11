const db = require('../config/database');

// Book a location
exports.bookLocation = async (req, res) => {
    const { location, date, time, email, phone, user } = req.body;

    try {
        // Validate request body
        if (!user || !user.id || !location || !date || !time || !email || !phone) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Ensure user exists
        const [existingUser] = await db.promise().query(
            'SELECT * FROM users WHERE id = ?',
            [user.id]
        );

        if (existingUser.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Insert booking into the database
        await db.promise().query(
            'INSERT INTO bookingsLocation (user_id, location, date, time, email, phone) VALUES (?, ?, ?, ?, ?, ?)',
            [user.id, location, date, time, email, phone]
        );

        res.status(201).json({ message: 'Booking successful!' });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


// Fetch all bookings
exports.getBookingsLocation = async (req, res) => {
    try {
        // Query the database to fetch all booking records
        const [rows] = await db.promise().query('SELECT * FROM bookingsLocation');

        // Respond with the fetched data
        res.status(200).json({
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings. Please try again later.',
        });
    }
};

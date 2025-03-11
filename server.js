const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/database');
const authRoutes = require('./routes/auth.route');
const moviesRoutes = require('./routes/movies.route');
const allmoviesRoutes = require('./routes/allmovies.route');
const foodRoutes = require('./routes/food.route');
const movieThRoute = require('./routes/moviesth.route');
const uploadRoutes = require('./routes/upload.route');
const booklocationRoutes = require('./routes/booklocation.route');
const bookmovielocationRoutes = require('./routes/movieslocation.route');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Check if the database connection is successful
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL database.');
});

// Test route

app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trending-movies', moviesRoutes);
app.use('/api/all-movies', allmoviesRoutes);
app.use('/api/all-food', foodRoutes);
app.use('/api/movieth', movieThRoute);
app.use('/api/booking', booklocationRoutes);
app.use('/api/booking-movie-location', bookmovielocationRoutes);
app.use('/api', uploadRoutes);

// Booking Route
// app.post("/api/booking", async (req, res) => {
//   const { userId, email, phone, location, date, time } = req.body;

//   if (!userId || !email || !phone || !location || !date || !time) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   try {
//     // Insert booking into the database
//     await db.promise().query(
//       "INSERT INTO bookings (user_id, email, phone, location, date, time) VALUES (?, ?, ?, ?, ?, ?)",
//       [userId, email, phone, location, date, time]
//     );

//     res.status(201).json({ message: "Booking successful." });
//   } catch (error) {
//     console.error("Error creating booking:", error.message);
//     res.status(500).json({ message: "Server error. Please try again later." });
//   }
// });

app.get('*', () => {});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

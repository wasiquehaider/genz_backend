const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database'); 

// Register a new user
exports.register = async (req, res) => {
    const { email, phone, password, confirmPassword } = req.body;

    try {
        // Validate confirmPassword
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        // Check if the email or phone already exists
        const [existingUser] = await db.promise().query(
            'SELECT * FROM users WHERE email = ? OR phone = ?',
            [email, phone]
        );
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email or phone already in use.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await db.promise().query(
            'INSERT INTO users (email, phone, password) VALUES (?, ?, ?)',
            [email, phone, hashedPassword]
        );

        // Get the newly created user's ID
        const [newUser] = await db.promise().query('SELECT LAST_INSERT_ID() AS id');
        const userId = newUser[0].id;

        // Generate a token
        const token = jwt.sign({ id: userId }, 'secret', { expiresIn: '1h' });

        // Send success response
        res.status(201).json({ message: 'Registration is completed!!!', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Login user
exports.login = async (req, res) => {
    const { phone, password } = req.body;

    try {
        // Find the user by phone
        const [user] = await db.promise().query('SELECT * FROM users WHERE phone = ?', [phone]);

        if (user.length === 0) {
            return res.status(401).json({ message: 'Invalid phone or password.' });
        }

        const userData = user[0];

        // Check password
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid phone or password.' });
        }

        // Generate a token
        const token = jwt.sign({ id: userData.id }, 'secret', { expiresIn: '1h' });

        // Include user data in the response
        res.json({
            token,
            user: {
                id: userData.id,
                name: userData.name, // Assuming you have a 'name' column
                email: userData.email,
                phone: userData.phone,
            },

        });
        console.log(user)

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


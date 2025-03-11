const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number'], // E.164 format
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
}, { timestamps: true });

// Hash the password before saving the user
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Export the User model
module.exports = mongoose.model('User', UserSchema);

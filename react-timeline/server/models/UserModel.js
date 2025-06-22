const mongoose = require('mongoose');
/**
 * Mongoose schema and model for application users.
 * 
 * userSchema:
 * - email: User's email address (string, required, unique).
 * - password: User's password (string, required).
 * - searchHistory: An array of strings storing the user's recent search queries (default empty array).
 * 
 * This schema defines the structure for user data in the database.
 * The model is exported as 'User' for use in user-related operations like registration and login.
 */

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  searchHistory: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);

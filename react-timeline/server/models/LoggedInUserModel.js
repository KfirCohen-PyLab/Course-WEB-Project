const mongoose = require('mongoose');

/**
 * Mongoose schema and model for tracking logged-in users.
 * 
 * loggedInUserSchema:
 * - email: The email address of the logged-in user (string, required).
 * - loginTime: The timestamp when the user logged in (Date, defaults to the current date and time).
 * 
 * This schema is used to record active login sessions.
 * The model is exported as 'LoggedInUser' for use in other parts of the application.
 */

const loggedInUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LoggedInUser', loggedInUserSchema);
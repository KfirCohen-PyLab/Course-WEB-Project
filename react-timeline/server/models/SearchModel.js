const mongoose = require('mongoose');

/**
 * Mongoose schema and model for caching search results.
 * 
 * searchSchema:
 * - query: The search term string used by the user.
 * - fullText: The full text extract (from Wikipedia) related to the query.
 * - timelineEvents: An array of timeline event objects generated for the query.
 * - images: An array of images associated with the query.
 * - createdAt: Timestamp indicating when the search record was created (defaults to current date/time).
 * 
 * This schema is used to store cached search results for faster retrieval.
 * The model is exported as 'Search' and explicitly mapped to the 'searches' collection in MongoDB.
 */

const searchSchema = new mongoose.Schema({
  query: String,
  fullText: String,
  timelineEvents: Array,
  images: Array,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Search', searchSchema, 'searches'); 
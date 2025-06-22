const mongoose = require('mongoose');

/**
 * Mongoose schema and model for storing cached timelines based on search queries.
 * 
 * timelineSchema:
 * - query: The search query string (unique and required).
 * - fullText: The full textual extract related to the query (required).
 * - timelineEvents: An array of timeline event objects extracted or generated from the text by Gemini.
 * - images: An array of image objects related to the query.
 * - createdAt: Timestamp indicating when the timeline was created (defaults to current date/time).
 * 
 * This schema is designed to cache timeline data for quicker future retrievals.
 * The model is exported as 'Timeline'.
 */


const timelineSchema = new mongoose.Schema({
  query: { type: String, unique: true, required: true },
  fullText: { type: String, required: true },
  timelineEvents: { type: [Object], default: [] },
  images: { type: [Object], default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Timeline', timelineSchema);
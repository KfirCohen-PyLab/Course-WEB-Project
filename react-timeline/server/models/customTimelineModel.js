const mongoose = require('mongoose');

/**
 * This module defines the MongoDB schemas for a custom timeline application using Mongoose.
 * 
 * EventSchema:
 * - Represents a single event in a timeline.
 * - Fields:
 *   - title: The event's title (string).
 *   - date: The date of the event (JavaScript Date object).
 *   - description: A detailed description of the event (string).
 *   - imageUrl: Optional URL for an image related to the event (string).
 * 
 * TimelineSchema:
 * - Represents a timeline created by a user.
 * - Fields:
 *   - userId: The ID of the user who owns the timeline (string).
 *   - timelineName: The name/title of the timeline (string).
 *   - events: An array of EventSchema objects representing the timeline's events.
 * 
 * The schema is exported as a Mongoose model named 'CustomTimeline'.
 */

const EventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  description: String,
  imageUrl: String
});

const TimelineSchema = new mongoose.Schema({
  userId: String,
  title: String,
  events: [EventSchema]
});

module.exports = mongoose.model('CustomTimeline', TimelineSchema);

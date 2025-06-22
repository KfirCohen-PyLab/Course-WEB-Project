const express = require('express');
const router = express.Router();
const Timeline = require('../models/customTimelineModel');

/**
 * @route   POST /create
 * @desc    Create a new custom timeline for a user.
 * @body    {string} userId - ID of the user
 * @body    {string} title  - Title of the timeline
 * @body    {Array}  events - Array of timeline event objects
 * @returns {Object}        - Created timeline
 */

const handleServerError = (res, error, message = 'Server error') => {
  console.error(message, error);
  res.status(500).json({ message });
};

router.post('/create', async (req, res) => {
  const { userId, title, events } = req.body;

  if (!userId || !Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ message: 'Missing userId or events' });
  }

  try {
    const newTimeline = new Timeline({ userId, title, events });
    await newTimeline.save();
    res.status(201).json({ message: 'Timeline created', timeline: newTimeline });
  } catch (err) {
    handleServerError(res, err, 'Error creating timeline');
  }
});

/**
 * @route   GET /user/:userId
 * @desc    Get all timelines created by a specific user
 * @param   {string} userId - ID of the user
 * @returns {Array}         - Array of timelines
 */
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const timelines = await Timeline.find({ userId });
    res.json(timelines);
  } catch (err) {
    handleServerError(res, err, 'Error fetching timelines');
  }
});

/**
 * @route   PUT /:timelineId
 * @desc    Update a timeline's title and/or events by ID
 * @param   {string} timelineId - ID of the timeline
 * @body    {string} [title]    - New title (optional)
 * @body    {Array}  [events]   - New array of events (optional)
 * @returns {Object}            - Updated timeline
 */
router.put('/:timelineId', async (req, res) => {
  const { timelineId } = req.params;
  const { title, events } = req.body;

  try {
    const timeline = await Timeline.findById(timelineId);
    if (!timeline) {
      return res.status(404).json({ message: 'Timeline not found' });
    }

    if (title) timeline.title = title;
    if (Array.isArray(events)) timeline.events = events;

    await timeline.save();
    res.json({ message: 'Timeline updated', timeline });
  } catch (err) {
    handleServerError(res, err, 'Error updating timeline');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const TimelineModel = require('../models/TimelineModel');
const { generateTimelineFromGemini } = require('../utils/gemini');
const { fetchUnsplashImages } = require('../utils/unsplash');
const { fetchWikipediaExtract } = require('../utils/wikipedia');
const Search = require('../models/SearchModel');
const { sortTimelineEvents, extractYear, filterTimelineEventsByYear } = require('../utils/timelineUtils');
const fetch = require('node-fetch');


/**
 * @route   GET /search
 * @desc    Search for a timeline by a query string ('q').
 *          Optionally filter timeline events by startYear and endYear.
 *          The flow is:
 *            1. Check if the query is cached in the database.
 *               - If yes, return cached data filtered by year range.
 *            2. If not cached, fetch Wikipedia extract for the query.
 *            3. Generate timeline events from the extract using Gemini.
 *            4. Fetch related images from Unsplash.
 *            5. Save the new timeline data in the database.
 *            6. Return the data filtered by year range.
 * @query   {string} q - The search term (required).
 * @query   {string} [startYear] - Optional start year for filtering timeline events.
 * @query   {string} [endYear] - Optional end year for filtering timeline events.
 * @returns {object} JSON containing:
 *           - extract: Wikipedia text extract,
 *           - timelineEvents: filtered list of timeline events,
 *           - images: related images,
 *           - source: indicates if data came from cache or generated fresh.
 * @returns {400} If query parameter 'q' is missing.
 * @returns {500} If there is any server or processing error.
 */

router.get('/search', async (req, res) => {
  const query = req.query.q;
  const startYearInput = req.query.startYear;
  const endYearInput = req.query.endYear;

  let startYear = extractYear(startYearInput); 
  let endYear = extractYear(endYearInput);

  if (startYear !== null && (endYear === null || endYearInput === undefined || endYearInput === "")) {
  endYear = new Date().getFullYear();
  }
  if ((startYear === null || startYearInput === undefined || startYearInput === "") && endYear !== null) {
    startYear = 1900;
  }
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  try {
    let cachedData = await TimelineModel.findOne({ query: query.toLowerCase() });
    if (cachedData) {
      console.log(`Found "${query}" in DB.`);
      let filteredEvents = cachedData.timelineEvents;
      if (startYear !== null && endYear !== null) {
        filteredEvents = filterTimelineEventsByYear(filteredEvents, startYear, endYear);
      }

      return res.json({
        extract: cachedData.fullText,
        timelineEvents: filteredEvents,
        images: cachedData.images,
        source: 'cache'
      });
    }

    const { fullText, missing } = await fetchWikipediaExtract(query);
    console.log("fullText:", fullText);
    console.log("missing:", missing);
    let timelineEvents = [];
    let images = [];
    if (missing) {
      console.log("term doesnt found");
      return res.json({
        extract: fullText,
        timelineEvents: [],
        images: [],
        source: 'not found',
      });}
      else {
      timelineEvents = await generateTimelineFromGemini(fullText);
      timelineEvents = sortTimelineEvents(timelineEvents);
      timelineEvents = timelineEvents.filter(event => extractYear(event.date) !== null);
      images = await fetchUnsplashImages(query); 
      console.log(`Gemini generated ${timelineEvents.length} events.`);
      console.log(`Found ${images.length} images`);
    }

    const newTimelineEntry = new TimelineModel({
      query: query.toLowerCase(),
      fullText,
      timelineEvents,
      images,
    });

    await newTimelineEntry.save();
    console.log(`Saved "${query}" to DB.`);

    let filteredEvents = timelineEvents;
    if (startYear !== null && endYear !== null) {
      filteredEvents = filterTimelineEventsByYear(timelineEvents, startYear, endYear);
    }

    return res.json({
      extract: fullText,
      timelineEvents: filteredEvents,
      images, 
      source: 'wikipedia + gemini'
    });

  } catch (error) {
    console.error('Error in /search:', error);
    res.status(500).json({ error: 'Failed to process search request.', details: error.message });
  }
});

module.exports = router;
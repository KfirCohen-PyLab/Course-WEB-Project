const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @route   GET /dataset
 * @desc    Retrieves all documents from the 'dataset' collection
 *          where the specified field (given by 'type') matches the given value ('topic').
 *          Supports exact match for numeric years, and case-insensitive partial match for other fields.
 * @query   {string} type  - The field name to search in (e.g., "Title", "Country", "Year")
 * @query   {string} topic - The value to search for
 * @returns {Array}        - List of matching documents
 */


router.get('/dataset', async (req, res) => {
  const { topic, type } = req.query;
  const collection = mongoose.connection.db.collection('dataset');
  let query = {};

  if (type === "Year") {
    const numericYear = parseInt(topic);
    if (isNaN(numericYear)) {
      return res.status(400).json({ message: 'Invalid year' });
    }
    query = { Year: numericYear };
  } else {
    query = {
      [type]: { $regex: topic, $options: 'i' }
    };
  }

  try {
    const results = await collection.find(query).toArray();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

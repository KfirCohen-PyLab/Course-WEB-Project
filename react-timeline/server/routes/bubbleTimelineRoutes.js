const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/dataset', async (req, res) => {
  
  console.log('Reached bubbleTimelineRoutes GET /api/dataset');
  const { topic, type } = req.query;
  const collection = mongoose.connection.db.collection('dataset');

  const query = {
    [type]: { $regex: topic, $options: 'i' } 
  };

  console.log('🧪 Query:', query);

  try {
    const results = await collection.find(query).toArray();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

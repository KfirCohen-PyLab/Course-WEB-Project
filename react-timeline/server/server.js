require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());
app.use(express.text({ type: '*/*' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully'); 
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const timelineRoutes = require('./routes/timelineRoutes');
const userRoutes = require('./routes/userRoutes');
const bubbleTimelineRoutes = require('./routes/bubbleTimelineRoutes');
const customTimelineRoutes = require('./routes/customTimelineRoutes');

app.use('/api/users', userRoutes);
app.use('/', timelineRoutes);
app.use('/api', bubbleTimelineRoutes);
app.use('/api/customtimelines', customTimelineRoutes);

//start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

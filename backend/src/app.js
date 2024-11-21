const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');


const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/games', require('./routes/games'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/leaderboards', require('./routes/leaderboards'));
app.use('/api/chats', require('./routes/chats'));

// Error handling middleware
app.use(errorHandler);

module.exports = app;
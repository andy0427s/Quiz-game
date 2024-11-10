const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/database');
const socketHandler = require('./src/utils/socketHandler');

const server = http.createServer(app);
const io = require('socket.io')(server);

// Connect to MongoDB
// connectDB();

// Set up socket handlers
socketHandler(io);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
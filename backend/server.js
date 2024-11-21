require("dotenv").config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/database');
const { Server } = require("socket.io");
const {socketHandler} = require('./src/utils/socketHandler');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE"], 
      credentials: true, 
    },
  });

// Connect to MongoDB
// connectDB();

// Set up socket handlers
socketHandler(io);

const PORT = process.env.PORT || 5001;

connectDB()
.then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
})
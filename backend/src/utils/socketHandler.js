const socketHandler = (io) => {
    io.on('connection', (socket) => {
      console.log('New client connected');
  
      socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
      });
  
      socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
      });
  
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  };
  
  module.exports = socketHandler;
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room.`);
    });

    socket.on('join_chat', (swapId) => {
      socket.join(`chat_${swapId}`);
      console.log(`Socket ${socket.id} joined chat_${swapId}`);
    });

    socket.on('send_message', async ({ swapId, content, senderId }) => {
      // Message saving handled in controller, this is for real-time delivery if needed
      // io.to(`chat_${swapId}`).emit('new_message', { swapId, content, senderId });
    });

    socket.on('typing', ({ swapId, userId }) => {
      socket.to(`chat_${swapId}`).emit('user_typing', { userId });
    });

    socket.on('stop_typing', ({ swapId, userId }) => {
      socket.to(`chat_${swapId}`).emit('user_stop_typing', { userId });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

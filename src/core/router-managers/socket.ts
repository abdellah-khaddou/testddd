let io;

module.exports = {
  init: (socketio) => {
    io = socketio;
    return io;
  },
  get: () => {
    if (!io) {
      throw new Error("socket is not initialized");
    }
    return io;
  }
};
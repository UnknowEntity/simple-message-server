const io = require("socket.io")();
let socketAPI = {};
const nsp = io.of("/message");

nsp.on("connection", (sockets) => {
  sockets.on("online check", (data) => {
    const { id } = data;
    sockets.join(`${id}`);
    sockets.to(`${id}`).emit("online check", { id, returnId: sockets.id });
  });

  sockets.on("declare is online", (data) => {
    const { id } = data;
    sockets.join(`${id}`);
    sockets.to(`${id}`).emit("yes online", { id, returnId: sockets.id });
  });

  sockets.on("yes online", (data) => {
    const { id, askerId } = data;
    sockets.to(askerId).emit("yes online", { id, returnId: sockets.id });
  });

  sockets.on("is typing", (data) => {
    const { myId, otherSocketId } = data;
    sockets.to(otherSocketId).emit("is typing", { senderId: myId });
  });

  sockets.on("stop typing", (data) => {
    const { myId, otherSocketId } = data;
    sockets.to(otherSocketId).emit("stop typing", { senderId: myId });
  });

  sockets.on("send message", (data) => {
    const { name, date, id, content, otherSocketId } = data;
    sockets.to(otherSocketId).emit("send message", {
      senderId: id,
      senderName: name,
      date,
      content,
      socketId: sockets.id,
    });
  });

  sockets.on("disconnecting", (reason) => {
    sockets.broadcast.emit("user offline", { id: sockets.id });
    console.log(sockets.rooms);
    console.log(reason);
  });
});

socketAPI.io = io;

module.exports = socketAPI;

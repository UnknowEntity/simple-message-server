const io = require("socket.io")();
let socketAPI = {};
const nsp = io.of("/message");

nsp.on("connection", (sockets) => {
  // sockets.on("parent wait", async (data) => {
  //   let isConnection = await connectionModel.checkConnection(data);
  //   if (isConnection) {
  //     let connectionString = await connectionModel.newConnectionString(data);
  //     sockets.emit("wait connect", { connectionString });
  //   } else {
  //     let connectionString = await connectionModel.setConnection(
  //       data,
  //       sockets.id
  //     );
  //     sockets.emit("wait connect", { connectionString });
  //   }
  // });
});

socketAPI.io = io;

module.exports = socketAPI;

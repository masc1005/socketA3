const net = require("net");

const { menu } = require("./helper");

const port = 7075;
const host = "127.0.0.1";

const server = net.createServer();

server.listen(port, host, () => {
  console.log(`Server is listening on ${host}:${port}`);
});

server.on("connection", (socket) => {
  menu(socket);
});

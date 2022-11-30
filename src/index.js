const net = require("node:net");
const path = require("node:path");

const helper = path.resolve(__dirname, "./helper");

const { menu } = require(helper);

const port = 7020;
const host = "127.0.0.1";

const server = net.createServer();

server.listen(port, host, () => {
  console.log(`Server is listening on ${host}:${port}`);
});

server.on("connection", (socket) => {
  menu(socket);
});

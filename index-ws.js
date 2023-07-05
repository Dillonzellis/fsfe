const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => {
  console.log("server started on port 3000");
});

const WebSocket = require("ws").Server;

const wss = new WebSocket({ server: server });

wss.on("connection", function connection(ws) {
  const numClient = wss.clients.size;
  console.log("clients connected", numClient);
  wss.broadcast(`current visitors: ${numClient}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("welcome to my server");
  }

  ws.on("close", function close() {
    wss.broadcast(`current visitors: ${numClient}`);
    console.log("a client has disconnected");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

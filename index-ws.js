const express = require("express");
const { get } = require("http");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => {
  console.log("server started on port 3000");
});

process.on("SIGINT", () => {
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    shutdownDB();
  });
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

  db.run(`INSERT INTO visitors (count, time)
      VALUES (${numClient}, datetime('now'))
  `);

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

const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )
  `);
});

function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  console.log("shutting down db");
  db.close();
}

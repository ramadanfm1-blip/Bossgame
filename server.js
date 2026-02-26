const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let bossHP = 1000;

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "update", hp: bossHP }));

  ws.on("message", () => {
    const damage = Math.floor(Math.random() * 20) + 5;
    bossHP -= damage;
    if (bossHP < 0) bossHP = 0;
    broadcast({ type: "update", hp: bossHP });
  });
});

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

app.use(express.static("public"));

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

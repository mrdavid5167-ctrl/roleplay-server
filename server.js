const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 8080;
const players = new Map();

app.get("/", (req, res) => {
  res.json({
    name: "Simple RP Server",
    status: "online",
    players: players.size
  });
});

app.get("/players", (req, res) => {
  res.json([...players.values()]);
});

function broadcast(data, except = null) {
  const message = JSON.stringify(data);

  for (const client of wss.clients) {
    if (
      client !== except &&
      client.readyState === WebSocket.OPEN
    ) {
      client.send(message);
    }
  }
}

wss.on("connection", (ws) => {
  const id = Math.random().toString(36).substring(2, 10);

  const player = {
    id: id,
    name: "Player",
    x: 0,
    y: 0
  };

  players.set(id, player);

  ws.send(JSON.stringify({
    type: "welcome",
    id: id,
    players: [...players.values()]
  }));

  broadcast({
    type: "playerJoined",
    player: player
  });

  ws.on("message", (raw) => {
    try {
      const data = JSON.parse(raw.toString());

      if (data.type === "join") {
        player.name =
          String(data.name || "Player").substring(0, 20);

        broadcast({
          type: "playerUpdated",
          player: player
        });
      }

      if (data.type === "move") {
        if (Number.isFinite(data.x)) {
          player.x = data.x;
        }

        if (Number.isFinite(data.y)) {
          player.y = data.y;
        }

        broadcast({
          type: "playerMoved",
          player: player
        }, ws);
      }

      if (data.type === "chat") {
        const text =
          String(data.text || "").trim().substring(0, 200);

        if (text) {
          broadcast({
            type: "chat",
            id: id,
            name: player.name,
            text: text,
            time: Date.now()
          });
        }
      }

    } catch (error) {
      ws.send(JSON.stringify({
        type: "error",
        message: "Invalid message"
      }));
    }
  });

  ws.on("close", () => {
    players.delete(id);

    broadcast({
      type: "playerLeft",
      id: id
    });
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("RP server running on port " + PORT);
});
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

const rooms = {};

io.on("connection", socket => {

  socket.on("joinRoom", ({ room, name }) => {
    socket.join(room);

    if (!rooms[room]) rooms[room] = [];
    rooms[room].push({ id: socket.id, name });

    io.to(room).emit("users", rooms[room]);
  });

  socket.on("emoji", ({ room, emoji }) => {
    io.to(room).emit("emoji", emoji);
  });

  socket.on("score", ({ room, score }) => {
    io.to(room).emit("score", score);
  });

  socket.on("disconnect", () => {
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(u => u.id !== socket.id);
      io.to(room).emit("users", rooms[room]);
    }
  });

});

app.use(express.static("client"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("🎤 Karaoke rodando na porta", PORT);
});


import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cors from "cors";
import RoomManager from "./roomManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
});

const roomManager = new RoomManager(io);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the Vite build (frontend)
const frontendDistPath = join(__dirname, "../../dist");
app.use(express.static(frontendDistPath));

// ... resto do código do WebSocket

// Handle client-side routing
app.get("*", (_req, res) => {
  res.sendFile(join(frontendDistPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

httpServer.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});

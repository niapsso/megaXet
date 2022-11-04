import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as HTTPServer } from "http";
import type { Server as IOServer } from "socket.io";

import { Server } from "socket.io";

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  switch (req.method) {
    case "POST":
      if (!res.socket.server.io) {
        const io = new Server(res.socket.server);

        res.socket.server.io = io;

        io.on("connection", (socket) => {
          socket.on("newMessage", async (msg) => {
            socket.broadcast.emit("updateMessages", msg);
          });
        });
      }

      return res.end();
  }
}

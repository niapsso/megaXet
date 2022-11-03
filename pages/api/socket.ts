import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as HTTPServer } from "http";
import type { Server as IOServer } from "socket.io";
import type { message } from "..";

import { Server } from "socket.io";
import { connection } from "../../utils/connection";

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  const { Message } = await connection();

  switch (req.method) {
    case "GET":
      return res.json(await Message.find({}).lean());
    case "POST":
      if (!res.socket.server.io) {
        const io = new Server(res.socket.server);

        res.socket.server.io = io;

        io.on("connection", (socket) => {
          socket.on("newMessage", async (msg: message) => {
            await Message.create(msg);

            const messages = await Message.find({}).lean();

            socket.broadcast.emit("updateMessages", messages);
          });
        });
      }

      return res.end();
    case "DELETE":
      await Message.deleteMany();

      return res.status(204).json({});
  }
}
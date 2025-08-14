import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!process.env.NEXT_PUBLIC_SERVER) {
    throw new Error("NEXT_PUBLIC_SERVER is not set in env");
  }

  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SERVER, {
      autoConnect: true,
    });
  }

  return socket;
};
  
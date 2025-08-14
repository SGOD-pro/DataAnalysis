import { Socket } from "socket.io-client";
import { create } from "zustand";
import { getSocket } from "@/lib/socket";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  setSocket: () => void;
  setIsConnected: (isConnected: boolean) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  isConnected: false,

  setSocket: () => {
    const sok = getSocket();
    set({
      socket: sok,
      isConnected: sok.connected,
    });
  },

  setIsConnected: (isConnected: boolean) => {
    set({ isConnected });
  },
}));

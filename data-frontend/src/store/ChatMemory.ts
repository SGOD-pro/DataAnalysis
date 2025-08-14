import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

interface ChatState {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage | ChatMessage[]) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()(
  immer((set) => ({
    messages: [],
    addMessage: (message) =>
      set((state) => {
        if (Array.isArray(message)) {
          state.messages.push(...message);
        } else state.messages.push(message);
      }),
    clearMessages: () =>
      set((state) => {
        state.messages = [];
      }),
  }))
);

export const chatStore = useChatStore.getState();

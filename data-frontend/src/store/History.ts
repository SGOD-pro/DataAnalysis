import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type HistoryState = {
  history: History[];
  addHistory: (history: History | History[]) => void;
  clearHistory: () => void;
  setHistory: (history: History[]) => void;
};

export const useHistoryStore = create<HistoryState>()(
  immer((set) => ({
    history: [],
    addHistory: (history: History | History[]) => {
      set((state) => ({
        history: Array.isArray(history)
          ? [...state.history, ...history] // merge array
          : [...state.history, history], // append single item
      }));
    },
    setHistory: (history: History[]) => {
      set((state) => {
        state.history = history;
      });
    },
    clearHistory: () => {
      set((state) => {
        state.history = [];
      });
    },
  }))
);

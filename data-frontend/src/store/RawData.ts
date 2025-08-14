import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface RawDataState {
  rows: number;
  columns: number;
  filename: string;
  data: any[];
  setData: (data: any) => void;
  clearData: () => void;
  setRows: (rows: number) => void;
  setColumns: (columns: number) => void;
  setFilename: (filename: string) => void;
}

const useRawDataStore = create<RawDataState>()(
  immer((set) => ({
    rows: 0,
    columns: 0,
    filename: "Default name",
    data: [],
    setData: (data: any) => set((state) => ({ ...state, data })),
    clearData: () => set((state) => ({ ...state, data: [] })),
    setRows: (rows: number) => set((state) => ({ ...state, rows })),
    setColumns: (columns: number) => set((state) => ({ ...state, columns })),
    setFilename: (filename: string) => set((state) => ({ ...state, filename })),
  }))
);

export default useRawDataStore;

//NOTE:

// If you just want to set the value (without worrying about reactivity here), you should call the store’s setter directly:
// useRawDataStore.setState({ filename: "My New File Name" });


// or if you want to use your setFilename action from the store:
// useRawDataStore.getState().setFilename("My New File Name");
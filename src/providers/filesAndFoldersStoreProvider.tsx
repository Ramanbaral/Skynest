"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type FilesAndFoldersStore,
  createFilesAndFoldersStore,
  initFilesAndFoldersStore,
} from "@/stores/filesAndFoldersStore";

export type FilesAndFoldersStoreApi = ReturnType<typeof createFilesAndFoldersStore>;

export const FilesAndFoldersStoreContext = createContext<
  FilesAndFoldersStoreApi | undefined
>(undefined);

export interface FilesAndFoldersStoreProviderProps {
  children: ReactNode;
}

export const FilesAndFoldersStoreProvider = ({
  children,
}: FilesAndFoldersStoreProviderProps) => {
  const storeRef = useRef<FilesAndFoldersStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createFilesAndFoldersStore(initFilesAndFoldersStore());
  }

  return (
    <FilesAndFoldersStoreContext.Provider value={storeRef.current}>
      {children}
    </FilesAndFoldersStoreContext.Provider>
  );
};

export const useFilesAndFoldersStore = <T,>(
  selector: (store: FilesAndFoldersStore) => T,
): T => {
  const filesAndFoldersStoreContext = useContext(FilesAndFoldersStoreContext);

  if (!filesAndFoldersStoreContext) {
    throw new Error(`useFilesAndFoldersStore must be used within CounterStoreProvider`);
  }

  return useStore(filesAndFoldersStoreContext, selector);
};

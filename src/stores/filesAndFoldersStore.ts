import { File } from "@/db/schema";
import { createStore } from "zustand/vanilla";

export type FilesAndFoldersState = {
  filesAndFolders: File[];
};

export type FilesAndFoldersActions = {
  setFilesAndFolders: (filesAndFolders: File[]) => void;
  addFilesAndFolders: (newFileOrFolder: File) => void;
  removeFilesAndFolders: (fileOrFolderId: string) => void;
};

export type FilesAndFoldersStore = FilesAndFoldersState & FilesAndFoldersActions;

export const initFilesAndFoldersStore = (): FilesAndFoldersState => {
  return { filesAndFolders: [] };
};

export const defaultFilesAndFoldersState: FilesAndFoldersState = { filesAndFolders: [] };

export const createFilesAndFoldersStore = (
  initState: FilesAndFoldersState = defaultFilesAndFoldersState,
) => {
  return createStore<FilesAndFoldersStore>()((set) => ({
    ...initState,
    setFilesAndFolders: (filesAndFolders: File[]) => {
      return set(() => ({ filesAndFolders: filesAndFolders }));
    },
    addFilesAndFolders: (newFileOrFolder: File) =>
      set((state) => {
        return { filesAndFolders: [newFileOrFolder, ...state.filesAndFolders] };
      }),
    removeFilesAndFolders: (fileOrFolderId: string) =>
      set((state) => ({
        filesAndFolders: state.filesAndFolders.filter(
          (item) => item.id !== fileOrFolderId,
        ),
      })),
  }));
};

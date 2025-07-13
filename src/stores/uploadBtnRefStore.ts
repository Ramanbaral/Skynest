import { create } from "zustand";
import { RefObject } from "react";

type UploadBtnRefStore = {
  btnRef: RefObject<HTMLButtonElement | null> | null;
  setBtnRef: (ref: RefObject<HTMLButtonElement | null>) => void;
};

export const useUploadBtnRefStore = create<UploadBtnRefStore>((set) => ({
  btnRef: null,
  setBtnRef: (ref) => set({ btnRef: ref }),
}));
